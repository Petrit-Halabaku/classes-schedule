"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle>Something went wrong!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            An error occurred while loading the application. Please try again.
          </p>
          <div className="flex flex-col space-y-2">
            <Button onClick={reset} className="w-full">
              Try again
            </Button>
            <Button onClick={() => (window.location.href = "/")} variant="outline" className="w-full">
              Go to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
