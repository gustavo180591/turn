import adapter from '@sveltejs/adapter-static';

export default {
  kit: {
    adapter: adapter({
      // Opciones del adaptador estático
      pages: 'build',
      assets: 'build',
      fallback: 'index.html',
      precompress: false
    }),
    alias: {
      $lib: 'src/lib'
    }
  }
};