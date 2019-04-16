'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
  'use strict';

  function Person(props) {
    return React.createElement(
      'div',
      { className: 'person' },
      React.createElement(
        'h3',
        null,
        props.person.name,
        ', ',
        props.person.title
      ),
      React.createElement(
        'p',
        null,
        React.createElement('img', { className: 'size-medium alignright', src: props.person.img,
          alt: props.person.name, width: '300', height: '300',
          sizes: '(max-width: 300px) 100vw, 300px' }),
        props.person.bio
      )
    );
  }

  function People(props) {
    return React.createElement(
      'div',
      { className: 'results' },
      React.createElement(
        ReactTransitionGroup.TransitionGroup,
        null,
        props.people.map(function (person) {
          return React.createElement(
            ReactTransitionGroup.CSSTransition,
            { timeout: 500, classNames: 'fade', key: person.id },
            React.createElement(Person, { person: person })
          );
        })
      )
    );
  }

  function Filters(props) {
    function updateName(evt) {
      props.updateFormState({ 'currentName': evt.target.value });
    }

    function updateTitle(evt) {
      props.updateFormState({ 'currentTitle': evt.target.value });
    }

    function updateIntern(evt) {
      props.updateFormState({ 'isIntern': evt.target.checked });
    }

    function resetFilters() {
      props.updateFormState({
        'currentName': '',
        'currentTitle': '',
        'isIntern': false
      });
    }

    return React.createElement(
      'form',
      { id: 'directory-filters' },
      React.createElement(
        'div',
        { className: 'group' },
        React.createElement(
          'label',
          { htmlFor: 'person-name' },
          'Name:'
        ),
        React.createElement('input', { type: 'text', name: 'person_name', placeholder: 'Name of employee', id: 'person-name', value: props.currentName, onChange: updateName })
      ),
      React.createElement(
        'div',
        { className: 'group' },
        React.createElement(
          'label',
          { htmlFor: 'person-title' },
          'Job Title:'
        ),
        React.createElement(
          'select',
          { name: 'person_title', id: 'person-title', value: props.currentTitle, onChange: updateTitle },
          React.createElement(
            'option',
            { key: 'none', value: '' },
            '- Select -'
          ),
          props.titles.map(function (title) {
            return React.createElement(
              'option',
              { key: title.key, value: title.key },
              title.display
            );
          })
        )
      ),
      React.createElement(
        'div',
        { className: 'group' },
        React.createElement(
          'label',
          null,
          React.createElement('input', { type: 'checkbox', value: '1', name: 'person_intern', checked: props.isIntern, onChange: updateIntern }),
          ' Intern'
        )
      ),
      React.createElement(
        'div',
        { className: 'group' },
        React.createElement('input', { type: 'reset', value: 'Reset', onClick: resetFilters })
      )
    );
  }

  var Directory = function (_React$Component) {
    _inherits(Directory, _React$Component);

    function Directory(props) {
      _classCallCheck(this, Directory);

      var _this = _possibleConstructorReturn(this, (Directory.__proto__ || Object.getPrototypeOf(Directory)).call(this, props));

      _this.state = {
        people: [],
        titles: [],
        currentName: '',
        currentTitle: '',
        isIntern: false,
        isLoaded: false
      };

      // cache the people data so we only do one AJAX call
      _this.peopleData = [];

      _this.updateFormState = _this.updateFormState.bind(_this);
      _this.updateFormStateAll = _this.updateFormStateAll.bind(_this);
      _this.updatePeopleList = _this.updatePeopleList.bind(_this);
      _this.showPeople = _this.showPeople.bind(_this);
      return _this;
    }

    _createClass(Directory, [{
      key: 'updateFormState',
      value: function updateFormState(name, val) {
        this.setState(_defineProperty({}, name, val), this.updatePeopleList);
      }
    }, {
      key: 'updateFormStateAll',
      value: function updateFormStateAll(spec) {
        this.setState(spec, this.updatePeopleList);
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        axios.get('./data.json').then(function (response) {
          this.peopleData = response.data.people;

          this.setState({
            isLoaded: true,
            people: this.peopleData,
            titles: response.data.titles
          });
        }.bind(this));
      }

      // search the whole employee list with current filters

    }, {
      key: 'updatePeopleList',
      value: function updatePeopleList() {
        var filteredPeople = this.peopleData.filter(function (person) {
          return person.intern === this.state.isIntern && (this.state.currentName === '' || person.name.toLowerCase().indexOf(this.state.currentName.toLowerCase()) !== -1) && (this.state.currentTitle === '' || person.title_cat === this.state.currentTitle);
        }.bind(this));

        this.setState({
          people: filteredPeople
        });
      }
    }, {
      key: 'showPeople',
      value: function showPeople() {
        if (this.state.isLoaded) {
          return React.createElement(People, { people: this.state.people });
        } else {
          return React.createElement(
            'div',
            { className: 'loading' },
            'Loading\u2026'
          );
        }
      }
    }, {
      key: 'render',
      value: function render() {
        var isLoaded = this.state.isLoaded;

        var people = null;
        if (isLoaded) {
          people = React.createElement(People, { people: this.state.people });
        } else {
          people = React.createElement(
            'div',
            { className: 'loading' },
            'Loading\u2026'
          );
        }

        return React.createElement(
          'div',
          { className: 'company-directory' },
          React.createElement(
            'h2',
            null,
            'Company Directory'
          ),
          React.createElement(
            'p',
            null,
            'Learn more about each person at Leaf & Mortar in this company directory.'
          ),
          React.createElement(Filters, { titles: this.state.titles, currentName: this.state.currentName, currentTitle: this.state.currentTitle, isIntern: this.state.isIntern, updateFormState: this.updateFormStateAll }),
          people
        );
      }
    }]);

    return Directory;
  }(React.Component);

  ReactDOM.render(React.createElement(Directory, null), document.getElementById('directory-root'));
})();
//# sourceMappingURL=directory-dist.js.map