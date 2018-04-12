import React from 'react';

import axios from 'axios';
import Auth from '../../lib/Auth';

class FilmsShowRoute extends React.Component {

  state = {
    content: {
      artwork: '',
      name: '',
      overview: '',
      mediaType: '',
      consumedStatus: false,
      userId: ''
    },
    followedUsers: [{
      content: [],
      email: '',
      filmLoverBadge: '',
      followedUsers: '',
      musicLoverBadge: '',
      tvLoverBadge: '',
      username: ''
    }],
    share: false
  }

  componentDidMount() {
    const tmdbId = this.props.match.params.id;
    const userId = Auth.getPayload().sub;

    axios.get(`/api/tmdbmovies/show/${tmdbId}`, {
      headers: {
        Authorization: `Bearer ${Auth.getToken()}`
      }
    })
      .then(res =>
        this.setState({
          content: {
            artwork: `https://image.tmdb.org/t/p/w500/${res.data.poster_path}`,
            name: res.data.title,
            overview: res.data.overview,
            mediaType: 'film',
            consumedStatus: false,
            userId: userId,
            resourceId: res.data.imdb_id,
            filmId: res.data.id
          }
        }));


    axios.get(`/api/user/${Auth.getPayload().sub}`, {
      headers: {
        Authorization: `Bearer ${Auth.getToken()}`
      }
    })
      .then(res => this.setState({ followedUsers: res.data.followedUsers }));
  }

  handleAdd = (e) => {
    e.preventDefault();
    axios.put(`/api/user/${this.state.content.userId}/content`, this.state, {
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })
      .then(() => this.props.history.push('/content'));
  }

  handleShareToggle = () => {
    this.setState({ share: !this.state.share }, () => console.log(this.state));
  }

  handleShare = (e) => {
    console.log(e.target.value);
    axios.post(`/api/user/${e.target.value}`, this.state, {
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    });
  }

  render() {

    const showContainer = {
      width: '60vw',
      margin: '0 auto'
    };

    return (
      <section className="columns is-multiline" style={showContainer}>

        <div className="column">
          <img src={this.state.content.artwork}/>
        </div>

        <div className="column">
          <h1>{this.state.content.name}</h1>
          <h2>{this.state.content.overview}</h2>

          <img
            className="show-buttons"
            src="/assets/plus.png"
            onClick={this.handleAdd}
          />

          {/* Share this content with a followedUser */}
          <img
            className="show-buttons"
            src="/assets/share.png"
            onClick={this.handleShareToggle}
          />
        </div>

        <div>
        </div>

        {this.state.share &&
        <ul className="columns is-multiline">
          {this.state.followedUsers.map((user, i) =>
            <div key={i} className="column is-one-quarter">
              <button
                value={user._id}
                onClick={this.handleShare}
              >{user.username}</button>
            </div>
          )}
        </ul>
        }
      </section>
    );
  }
}

export default FilmsShowRoute;
