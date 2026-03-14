"use client"

import { useEffect, useRef } from "react"

interface GoogleCredentialResponse {
  credential: string
}

interface GoogleSignInButtonProps {
  clientId: string
  disabled?: boolean
  onCredential: (credential: string) => void | Promise<void>
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string
            callback: (response: GoogleCredentialResponse) => void
          }) => void
          renderButton: (
            element: HTMLElement,
            options: {
              type?: "standard" | "icon"
              theme?: "outline" | "filled_blue" | "filled_black"
              size?: "large" | "medium" | "small"
              text?: "signin_with" | "signup_with" | "continue_with" | "signin"
              shape?: "rectangular" | "pill" | "circle" | "square"
              width?: string | number
            }
          ) => void
        }
      }
    }
  }
}

const GOOGLE_SCRIPT_ID = "google-identity-services"

export function GoogleSignInButton({ clientId, disabled = false, onCredential }: GoogleSignInButtonProps) {
  const buttonContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!clientId || disabled) {
      return
    }

    const renderGoogleButton = () => {
      if (!window.google?.accounts?.id || !buttonContainerRef.current) {
        return
      }

      buttonContainerRef.current.innerHTML = ""
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: GoogleCredentialResponse) => {
          if (response.credential) {
            onCredential(response.credential)
          }
        },
      })

      window.google.accounts.id.renderButton(buttonContainerRef.current, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        width: "260",
      })
    }

    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID) as HTMLScriptElement | null
    if (existingScript) {
      if (window.google?.accounts?.id) {
        renderGoogleButton()
      } else {
        existingScript.addEventListener("load", renderGoogleButton)
      }

      return () => {
        existingScript.removeEventListener("load", renderGoogleButton)
      }
    }

    const script = document.createElement("script")
    script.id = GOOGLE_SCRIPT_ID
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    script.addEventListener("load", renderGoogleButton)
    document.head.appendChild(script)

    return () => {
      script.removeEventListener("load", renderGoogleButton)
    }
  }, [clientId, disabled, onCredential])

  if (!clientId) {
    return null
  }

  return <div ref={buttonContainerRef} className="flex justify-center" />
}
