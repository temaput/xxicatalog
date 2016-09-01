import Relay from 'react-relay';

export default class extends Relay.Route {
  static queries = {
    catalog: () => Relay.QL`
      query {
      catalog
      }
    `,
  };
  static routeName = 'AppHomeRoute';
}
