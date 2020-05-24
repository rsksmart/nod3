
import dns from 'dns'
export const checkConection = () => {
  return new Promise((resolve, reject) => {
    dns.lookupService('8.8.8.8', 53, (err, hostname, service) => {
      if (err) return reject(err)
      else resolve({ hostname, service })
    })
  })
}
