import { API_BASE_URL, APP_NAME, USER_ID } from '@/lib/constants/agents'
import type { AdkEvent, SessionResponse } from '@/lib/types'

export class AdkApiError extends Error {
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'AdkApiError'
    this.status = status
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text().catch(() => 'Unknown error')
    throw new AdkApiError(text || response.statusText, response.status)
  }
  return response.json() as Promise<T>
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/list-apps`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    })
    return response.ok
  } catch {
    return false
  }
}

export async function createSession(): Promise<SessionResponse> {
  const response = await fetch(
    `${API_BASE_URL}/apps/${APP_NAME}/users/${USER_ID}/sessions`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    },
  )
  return handleResponse<SessionResponse>(response)
}

export async function getSession(sessionId: string): Promise<SessionResponse> {
  const response = await fetch(
    `${API_BASE_URL}/apps/${APP_NAME}/users/${USER_ID}/sessions/${sessionId}`,
  )
  return handleResponse<SessionResponse>(response)
}

export interface RunAgentOptions {
  sessionId: string
  message: string
  onEvent: (event: AdkEvent) => void
  onError?: (error: Error) => void
  onComplete?: () => void
  signal?: AbortSignal
}

export async function runAgentSSE({
  sessionId,
  message,
  onEvent,
  onError,
  onComplete,
  signal,
}: RunAgentOptions): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/run_sse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      appName: APP_NAME,
      userId: USER_ID,
      sessionId,
      newMessage: {
        role: 'user',
        parts: [{ text: message }],
      },
      streaming: true,
    }),
    signal,
  })

  if (!response.ok) {
    const text = await response.text().catch(() => 'Failed to start analysis')
    throw new AdkApiError(text, response.status)
  }

  const reader = response.body?.getReader()
  if (!reader) {
    throw new AdkApiError('No response stream available')
  }

  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        if (!line.startsWith('data:')) continue
        const data = line.slice(5).trim()
        if (!data) continue

        try {
          const event = JSON.parse(data) as AdkEvent & { error?: string }
          if (event.error) {
            onError?.(new AdkApiError(event.error))
            continue
          }
          onEvent(event)
        } catch {
          // Skip malformed SSE chunks
        }
      }
    }
    onComplete?.()
  } catch (error) {
    if (error instanceof Error && error.name !== 'AbortError') {
      onError?.(error)
      throw error
    }
  } finally {
    reader.releaseLock()
  }
}
