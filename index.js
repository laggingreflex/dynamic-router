module.exports = (lib) => {
  const h = lib.h || lib.createElement;
  const Component = lib.Component;

  return class extends Component {

    componentWillMount() {
      this.previousPaths = [];
      this.redirectLimit = this.props.redirectLimit || 10;
      this.redirectLimitTime = this.props.redirectLimitTime || 1000;
      if (this.props.publicPath && this.props.publicPath !== '/') {
        this.publicPathRegexp = new RegExp('^' + this.props.publicPath);
      }
      this.setState({ path: window.location.pathname });
      window.addEventListener('popstate', () => this.updatePath());
    }

    handlePublicPath(path) {
      if (this.publicPathRegexp && !path.match(/^[.]/) && !this.publicPathRegexp.test(path)) {
        return this.props.publicPath + path;
      } else {
        return path;
      }
    }

    updatePath(path = window.location.pathname) {
      const pathArg = path;
      if (this.detectTooManyRedirects(path)) return;
      path = this.handlePublicPath(path);
      // TODO:? handle file:// protocol
      window.history.pushState(null, null, path);
      path = window.location.pathname;
      this.setState({ path });
      this.log(`${[...arguments]} -> ${path}`, this.state);
    }

    render() {
      if (this.state.tooManyRedirects) {
        console.error(`Error: Too many redirects: ${this.previousPaths.length} in ${this.tooManyRedirectsTimeDiff}ms`, this.previousPaths.map(_ => _.path));
        return this.handleTooManyRedirects();
      }
      const router = this.props.router;
      if (!router) throw new Error('Need a router');
      const routerProps = {};
      routerProps.path = (this.state && this.state.path) || window.location.pathname;
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
        this.updatePath(path);
      });
      return h(router, Object.assign({}, this.props, { router: routerProps }));
    }

    detectTooManyRedirects(path) {
      const currentPath = { path, time: new Date };
      this.previousPaths.push(currentPath);
      if (this.previousPaths.length > this.redirectLimit) {
        const firstPath = this.previousPaths.shift();
        this.tooManyRedirectsTimeDiff = Math.abs(Number(firstPath.time) - Number(currentPath.time));
        // console.log(`this.timeDiff:`, this.tooManyRedirectsTimeDiff);
        if (this.tooManyRedirectsTimeDiff < this.redirectLimitTime) {
          this.tooManyRedirectsFlag = true;
        }
      }
      clearTimeout(this.clearPreviousPaths);
      this.clearPreviousPaths = setTimeout(() => {
        this.clearPreviousPaths = [];
        this.tooManyRedirectsFlag = false;
      }, 1000);
      this.setState({ tooManyRedirects: this.tooManyRedirectsFlag });
      return this.tooManyRedirectsFlag;
    }

    handleTooManyRedirects() {
      if (this.props.handleTooManyRedirects) {
        return this.props.handleTooManyRedirects();
      } else {
        return 'Error: Too many redirects';
      }
    }

    log(...msg) {
      if (!this.props.log) return;
      console.log(...msg);
    }

  }
}
