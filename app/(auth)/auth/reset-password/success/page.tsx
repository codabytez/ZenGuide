export default function Success() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Password Reset Successful</h1>
        <a href="/auth/login" className="text-primary underline">
          Back to Login
        </a>
      </div>
    </div>
  );
}
