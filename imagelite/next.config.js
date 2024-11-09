/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/galeria',
        permanent: true,
      },
    ]
  }
}

module.exports = nextConfig
