import { useEffect, useRef } from 'react'
import { useSandpack } from '@codesandbox/sandpack-react'

export interface UseSandpackFilesProps {
  onFilesChange?: (files: Record<string, string>) => void
}

export function useSandpackFiles({ onFilesChange }: UseSandpackFilesProps = {}) {
  const { sandpack } = useSandpack()
  const filesRef = useRef<Record<string, string>>({})
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const prevFilesRef = useRef<string>('')

  useEffect(() => {
    const interval = setInterval(() => {
      const currentFiles = sandpack.files
      const currentFilesString = JSON.stringify(currentFiles)
      
      if (currentFilesString !== prevFilesRef.current) {
        prevFilesRef.current = currentFilesString
        
        const files: Record<string, string> = {}
        Object.entries(currentFiles).forEach(([path, file]) => {
          if (typeof file === 'object' && file.code) {
            files[path] = file.code
          }
        })
        
        filesRef.current = files
        onFilesChange?.(files)
      }
    }, 1000)

    return () => {
      clearInterval(interval)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [sandpack.files, onFilesChange])

  return {
    files: filesRef.current,
    getFiles: () => {
      const files: Record<string, string> = {}
      Object.entries(sandpack.files).forEach(([path, file]) => {
        if (typeof file === 'object' && file.code) {
          files[path] = file.code
        }
      })
      return files
    },
  }
}
