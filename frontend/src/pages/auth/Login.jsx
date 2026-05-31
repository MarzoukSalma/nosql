import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../api/auth.api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await login(form);
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("userId", res.data.etudiant.id);
      localStorage.setItem("user", JSON.stringify(res.data.etudiant));
      navigate("/messages");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Colonne gauche */}
      <div className="hidden lg:flex w-1/2 bg-[#0d1b2a] flex-col justify-between p-12 relative overflow-hidden">
        {/* Points décoratifs */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-teal-400 opacity-20"
              style={{
                width: Math.random() * 6 + 3 + "px",
                height: Math.random() * 6 + 3 + "px",
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
              }}
            />
          ))}
        </div>

        {/* Header */}
        <div className="relative z-10">
          <div className="w-12 h-12 bg-teal-500 bg-opacity-20 rounded-xl flex items-center justify-center mb-16">
            <svg
              className="w-6 h-6 text-teal-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>

          <h2 className="text-white text-4xl font-bold leading-tight mb-4">
            Content de vous
            <br />
            revoir
          </h2>
          <div className="w-12 h-1 bg-teal-400 mb-8" />

          <blockquote className="border-l-2 border-teal-400 pl-4 mb-2">
            <p className="text-gray-300 text-sm italic">
              "L'éducation n'est pas la préparation à la vie ; l'éducation est
              la vie elle-même."
            </p>
          </blockquote>
          <p className="text-teal-400 text-sm ml-4">— John Dewey</p>

          <p className="text-gray-400 text-sm mt-8">
            Poursuivez votre exploration du graphe de connaissances et
            connectez-vous avec vos pairs aujourd'hui.
          </p>
        </div>

        {/* Avatars */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="flex -space-x-2">
            {["S", "A", "M"].map((l, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-full bg-teal-700 border-2 border-[#0d1b2a] flex items-center justify-center text-white text-xs font-semibold"
              >
                {l}
              </div>
            ))}
          </div>
          <div className="w-9 h-9 rounded-full bg-teal-500 bg-opacity-30 border-2 border-[#0d1b2a] flex items-center justify-center text-teal-300 text-xs font-semibold">
            +12k
          </div>
        </div>
      </div>

      {/* Colonne droite */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Se connecter
          </h1>
          <p className="text-gray-400 text-sm mb-8">
            Accédez à votre espace membre et vos ressources.
          </p>

          {error && (
            <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-sm text-gray-600 mb-1.5 block">
                Email ou Identifiant
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="nom@exemple.com"
                  className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm text-gray-600">Mot de passe</label>
                <span className="text-sm text-teal-500 cursor-pointer hover:underline">
                  Mot de passe oublié ?
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-lg pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        showPassword
                          ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21"
                          : "M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      }
                    />
                  </svg>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0d1b2a] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#1a2f45] transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                "Connexion..."
              ) : (
                <>
                  Se connecter <span>→</span>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Pas encore membre ?{" "}
            <Link
              to="/register"
              className="text-gray-900 font-semibold hover:underline"
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
