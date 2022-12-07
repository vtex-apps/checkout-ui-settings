const isEmailAddress = (email: string | undefined): boolean => {
  if (!email) return false
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  const re = new RegExp(regex)

  return re.test(String(email).toLowerCase())
}

export default isEmailAddress
