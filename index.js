module.exports = (lib) => {
  const h = lib.h || lib.createComponent;
  const Component = lib.Component;

  return class extends Component {

    componentWillMount() {
      if (this.props.publicPath && this.props.publicPath !== '/') {
        this.publicPathRegexp = new RegExp('^' + this.props.publicPath);
      }
    }

    updatePath(path = window.location.pathname) {
      if (this.publicPathRegexp && !this.publicPathRegexp.test(path)) {
        path = this.props.publicPath + path;
      }
      this.setState({ path });
    }
    componentDidMount() {
      this.setState({ path: window.location.pathname });
      window.addEventListener('popstate', () => this.updatePath());
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
          // TODO: handle file:// protocol
          window.history.pushState(null, null, path);
          this.updatePath(path);
        }
      }, [text]);
      routerProps.route = path => setTimeout(() => {
        window.history.pushState(null, null, path);
        this.updatePath(path);
      });
      return h(router, Object.assign({}, this.props, { router: routerProps }))
    }
  }
}
