module.exports = (lib) => {
  const h = lib.h || lib.createComponent;
  const Component = lib.Component;

  return class extends Component {

    componentWillMount() {
      if (this.props.publicPath && this.props.publicPath !== '/') {
        this.publicPathRegexp = new RegExp('^' + this.props.publicPath);
      }
    }

    handlePublicPath(path) {
      if (this.publicPathRegexp && !path.match(/^[.]/) && !this.publicPathRegexp.test(path)) {
        return this.props.publicPath + path;
      } else {
        return path;
      }
    }

    updatePath(path = window.location.pathname) {
      path = this.handlePublicPath(path);
      // TODO:? handle file:// protocol
      window.history.pushState(null, null, path);
      path = window.location.pathname;
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
      routerProps.link = (path, text) => {
        path = this.handlePublicPath(path);
        return h('a', {
          href: path,
          onclick: (e) => {
            e.preventDefault();
            this.updatePath(path);
          }
        }, [text]);
      };
      routerProps.route = path => setTimeout(() => {
        window.history.pushState(null, null, path);
        this.updatePath(path);
      });
      return h(router, Object.assign({}, this.props, { router: routerProps }));
    }
  }
}
