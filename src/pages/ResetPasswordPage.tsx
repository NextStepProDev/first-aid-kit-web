import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; // Tego brakowało
import { useForm } from 'react-hook-form'; // Tego brakowało
import { authApi } from '../api/auth'; // Tego brakowało
import toast from 'react-hot-toast'; // Tego brakowało

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      if (!token) {
        toast.error("Brak poprawnego tokenu w linku.");
        return;
      }
      await authApi.resetPassword({
        token: token,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
      });
      toast.success("Hasło zostało zmienione!");
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Błąd podczas resetowania hasła");
    }
  };

  return (
    <div className="auth-container min-h-screen flex items-center justify-center bg-dark-900 p-4">
      <div className="w-full max-w-md bg-dark-800 p-8 rounded-lg border border-dark-600 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Ustaw nowe hasło</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register("newPassword", { 
                required: "Hasło jest wymagane",
                minLength: { value: 8, message: "Hasło musi mieć min. 8 znaków" }
              })}
              type="password"
              placeholder="Nowe hasło"
              className={`w-full p-3 bg-dark-700 border ${errors.newPassword ? 'border-red-500' : 'border-dark-600'} rounded text-white outline-none focus:border-primary-500 transition-colors`}
            />
            {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message as string}</p>}
          </div>

          <div>
            <input
              {...register("confirmPassword", { 
                required: "Powtórz hasło", 
                validate: (value: any, formValues: any) => value === formValues.newPassword || "Hasła nie są identyczne" 
              })}
              type="password"
              placeholder="Powtórz nowe hasło"
              className={`w-full p-3 bg-dark-700 border ${errors.confirmPassword ? 'border-red-500' : 'border-dark-600'} rounded text-white outline-none focus:border-primary-500 transition-colors`}
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message as string}</p>}
          </div>

          <button 
            type="submit" 
            className="w-full bg-primary-500 hover:bg-primary-600 text-white p-3 rounded font-bold transition-all mt-2"
          >
            Zmień hasło
          </button>
        </form>
      </div>
    </div>
  );
};