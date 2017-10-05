module.exports = (lib) => {
  const h = lib.h || lib.createComponent;
  const Component = lib.Component;

  return class extends Component {
    componentDidMount() {
      this.setState({ path: window.location.pathname });
    }
    render() {
      const router = this.props.router;
      if (!router) throw new Error('Need a router');
      return h(router, {
        path: this.state.path,
        link: (path, text) => h('a', {
          href: path,
          onclick: (e) => {
            e.preventDefault();
            window.history.pushState(null, null, path);
            this.setState({ path })
          }
        }, [text])
      })
    }
  }
}
