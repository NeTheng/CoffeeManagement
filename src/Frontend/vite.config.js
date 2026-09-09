export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://api:8080',
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
    host: '0.0.0.0',
    port: 5173,
  },
}
