export function ErrorMessage({ message }: { message: string }) {
  return (
    <p role="alert" className="feedback feedback--error">
      {message}
    </p>
  )
}
