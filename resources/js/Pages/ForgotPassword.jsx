// resources/js/Pages/Auth/ForgotPassword.jsx
import { useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('password.email'));
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Reset Password</h1>
      
      {status && (
        <div className="mb-4 text-green-600">
          {status}
        </div>
      )}

      <form onSubmit={submit}>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">Email</label>
          <input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          {errors.email && <p className="text-red-500 mt-1">{errors.email}</p>}
        </div>

        <button 
          type="submit" 
          disabled={processing}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {processing ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
}