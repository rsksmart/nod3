export default {

  content () {
    return { method: 'txpool_content', formatter: txPoolFormatter }
  },

  inspect () {
    return { method: 'txpool_inspect', formatter: txPoolFormatter }
  },

  status () {
    return { method: 'txpool_status', formatter: txPoolFormatter }
  }
}

// fix bad rskj response
// see: https://github.com/rsksmart/rskj/issues/689
export const txPoolFormatter = result => (typeof result === 'string') ? JSON.parse(result) : result
