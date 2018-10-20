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

export const txPoolFormatter = result => JSON.parse(result)
