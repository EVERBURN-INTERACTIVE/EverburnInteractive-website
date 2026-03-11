export function WebGLFallback() {
  return (
    <main className="webgl-fallback">
      <svg width="100" height="100" viewBox="0 0 100 100" aria-hidden>
        <path d="M50 8C60 24 80 33 80 57C80 75 66 92 50 92C34 92 20 75 20 57C20 33 40 24 50 8Z" fill="#ff6a00" />
      </svg>
      <h1>Everburn Interactive</h1>
      <p>Your browser does not support WebGL. Please try a modern browser.</p>
      <nav>
        <a href="/games">Games</a>
        <a href="/technology">Technology</a>
        <a href="/studio">Studio</a>
        <a href="/contact">Contact</a>
      </nav>
    </main>
  );
}