export const isBrowser = () => typeof window !== "undefined"

export const getUser = () =>
  isBrowser() && window.localStorage.getItem("gatsbyUser")
    ? JSON.parse(window.localStorage.getItem("gatsbyUser"))
    : {}

const setUser = user =>
  window.localStorage.setItem("gatsbyUser", JSON.stringify(user))

export const handleLogin = ({ email, firstName }) => {
  // console.log('auth', email);
  return setUser({
    email: email,
    firstName: firstName
  })
}

export const isLoggedIn = () => {
  const user = getUser()
  // console.log('user', user);
  return !!user.email
}
export const logout = callback => {
  setUser({})
  callback()
}