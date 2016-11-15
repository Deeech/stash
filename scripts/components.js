var BookmarkInfo = function(props) {
  return (
    <a className="bookmark-link" href={props.link}>
      <h3 className="bookmark-link-head">{props.name}</h3>
      <p className="bookmark-link-descr">{props.description}</p>
    </a>
  );
}

var Bookmark = React.createClass({

  render: function() {
    return (
      <div className="bookmark">
        <BookmarkInfo link={this.props.link} name={this.props.name} description={this.props.description} />
        <p className="bookmark-category">{this.props.category}</p>
      </div>
    );
  }
});

var AddNew = React.createClass({
  render: function() {
    return (
      <form className="new-bookmark-form">
        <input type="text" />
        <button>Добавить</button>
      </form>
    );
  }
});

var Sidebar = React.createClass({
  render: function() {
    return (
      <aside className="categories"></aside>
    );
  }
});

var Stash = React.createClass({
  render: function() {
    return (
      <div className="main-wrapper">

        <Sidebar/>

        <section>
          <div className="bookmarks-holder">
            {this.props.bookmarks.map(function(bookmark) {
              return <Bookmark
                key={bookmark.id}
                name={bookmark.name}
                description={bookmark.description}
                link={bookmark.link}
                category={bookmark.category}
                />
            })}
          </div>

          <AddNew/>

        </section>
      </div>
    );
  }
});


let bookmarksData = [
  {
    id: 1,
    name: 'React',
    description: 'A JAVASCRIPT LIBRARY FOR BUILDING USER INTERFACES',
    link: 'facebook.github.io/react',
    category: 'code'
  }, {
    id: 2,
    name: 'Angular',
    description: 'One framework. Mobile & desktop.',
    link: 'angular.io',
    category: 'code'
  }, {
    id: 3,
    name: 'Science AAAS',
    description: 'International weekly science journal',
    link: '#',
    category: 'science'
  }, {
    id: 4,
    name: 'N+1',
    description: 'N+1: научные статьи, новости, открытия',
    link: 'nplus1.ru',
    category: 'science'
  }, {
    id: 5,
    name: 'Steam',
    description: 'Wellcome to Steam',
    link: 'store.steampowered.com',
    category: 'entertainment'
  }
];

ReactDOM.render(<Stash bookmarks={bookmarksData} />, document.getElementById('root'));
