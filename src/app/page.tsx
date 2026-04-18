"use client";

import { useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState<any>(null);
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function buscarUsuario() {
    try {
      setLoading(true);
      setError("");

      const userRes = await fetch(`https://api.github.com/users/${username}`);
      if (!userRes.ok) throw new Error("Usuário não encontrado");

      const userData = await userRes.json();

      const repoRes = await fetch(
        `https://api.github.com/users/${username}/repos`
      );
      const repoData = await repoRes.json();

      // ordenar por estrelas ⭐
      const reposOrdenados = repoData.sort(
        (a: any, b: any) => b.stargazers_count - a.stargazers_count
      );

      setUser(userData);
      setRepos(reposOrdenados);
    } catch (err: any) {
      setError(err.message);
      setUser(null);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  }

return (
  <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center p-6 gap-6">
    <h1 className="text-4xl font-bold">GitView</h1>

    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Digite um usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="bg-zinc-800 border border-zinc-700 p-2 rounded w-64"
      />

      <button
        onClick={buscarUsuario}
        className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded"
      >
        Buscar
      </button>
    </div>

    {loading && <p className="text-zinc-400">Carregando...</p>}

    {error && <p className="text-red-400">{error}</p>}

    {user && (
      <div className="bg-zinc-800 p-4 rounded text-center w-full max-w-md shadow">
        <img
          src={user.avatar_url}
          alt="avatar"
          className="w-24 rounded-full mx-auto mb-2"
        />
        <h2 className="text-xl font-bold">{user.name}</h2>
        <p className="text-zinc-400">{user.bio}</p>
      </div>
    )}

    {repos.length > 0 && (
      <div className="w-full max-w-md">
        <h3 className="text-lg font-bold mb-2">Repositórios:</h3>

        {repos.map((repo) => (
          <div
            key={repo.id}
            className="bg-zinc-800 p-3 rounded mb-2 flex justify-between hover:bg-zinc-700 transition"
          >
            <span>{repo.name}</span>
            <span>⭐ {repo.stargazers_count}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);
}