import profileView from '../views/profile.art'

class Profile {
  render() {
    let html = profileView();
    $('main').html(html);

    $('title').html('我的');
    $('.nav-header').html('我的');
  }
}

export default new Profile()