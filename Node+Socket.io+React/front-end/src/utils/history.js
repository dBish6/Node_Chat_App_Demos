// Allows the use of useNavigate outside react components.
const history = {
  navigate: null,
  push: (page, ...rest) => history.navigate(page, ...rest),
};

export default history;
