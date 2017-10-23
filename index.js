module.exports = (lib) => {
  const h = lib.h || lib.createComponent;
  const Component = lib.Component;

  return class extends Component {

    update(path = window.location.pathname) {
      this.setState({ path });
    }
    componentDidMount() {
      this.setState({ path: window.location.pathname });
      window.addEventListener('popstate', () => this.update());
    }
    render() {
      const router = this.props.router;
      if (!router) throw new Error('Need a router');
      const routerProps = {};
      routerProps.path = this.state.path || window.location.pathname;
      routerProps.link = (path, text) => h('a', {
        href: path,
        onclick: (e) => {
          e.preventDefault();
          window.history.pushState(null, null, path);
          this.update(path);
        }
      }, [text]);
      routerProps.route = path => setTimeout(() => {
        window.history.pushState(null, null, path);
        this.update(path);
      });
      return h(router, Object.assign({}, this.props, { router: routerProps }))
    }
  }
}
