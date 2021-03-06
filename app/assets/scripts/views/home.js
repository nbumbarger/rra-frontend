'use strict';
import React, { PropTypes as T } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import c from 'classnames';
import TimeAgo from 'timeago-react';

import {
  invalidateProjects,
  fetchProjects,
  postProject,
  resetProjectFrom
} from '../actions';
import { prettyPrint } from '../utils/utils';
import { t, getLanguage } from '../utils/i18n';
import { showGlobalLoading, hideGlobalLoading } from '../components/global-loading';

import ProjectFormModal from '../components/project/project-form-modal';

const projectStatusMatrix = {
  active: 'Active',
  pending: 'Draft'
};

var Home = React.createClass({
  displayName: 'Home',

  propTypes: {
    _invalidateProjects: T.func,
    _fetchProjects: T.func,
    _postProject: T.func,
    _resetProjectFrom: T.func,

    projects: T.object,
    projectForm: T.object
  },

  getInitialState: function () {
    return {
      projectFormModal: false
    };
  },

  openModal: function () {
    this.setState({projectFormModal: true});
  },

  closeModal: function () {
    this.setState({projectFormModal: false});
  },

  componentDidMount: function () {
    this.props._fetchProjects();
    showGlobalLoading();
  },

  componentWillReceiveProps: function (nextProps) {
    if (this.props.projects.fetching && !nextProps.projects.fetching) {
      hideGlobalLoading();
    }
  },

  renderProjectListItem: function (project) {
    let projectUrl = project.status === 'pending'
      ? `/${getLanguage()}/projects/${project.id}/setup`
      : `/${getLanguage()}/projects/${project.id}`;

    let cardSubtitle;
    if (project.status === 'pending') {
      cardSubtitle = t('Pending scenarios');
    } else {
      cardSubtitle = project.scenarioCount === 1
        ? t('1 scenario')
        : t('{count} scenarios', {count: project.scenarioCount});
    }

    return (
      <li key={project.id}>
        <article className='project project--card card' id={`project-${project.id}`}>
          <div className='card__contents'>
            <figure className='card__media'>
              <Link to={projectUrl} title='View project' className='link-wrapper'>
                <div className='card__thumbnail'>
                  <img alt={t('Project thumbnail')} width='640' height='320' src='/assets/graphics/layout/projects-thumbnail-placeholder.png' />
                </div>
              </Link>
            </figure>
            <header className='card__header'>
              <div className='card__headline'>
                <Link to={projectUrl} title={t('View project')} className='link-wrapper'>
                  <h1 className='card__title'>{project.name}</h1>
                </Link>
                <p className='card__subtitle'>{cardSubtitle}</p>
              </div>
            </header>
            <div className='card__body'>
              <div className='card__summary'>
                {project.description ? (
                <p>{project.description}</p>
                ) : (
                <p>{t('No description.')}</p>
                )}
              </div>
            </div>
            <footer className='card__footer'>
              <dl className='card__system-details'>
                <dt>Updated</dt>
                <dd className='updated'><TimeAgo datetime={project.updated_at} /></dd>
                <dt>Status</dt>
                <dd className='status'><span className={c('label', {'label--success': project.status === 'active', 'label--danger': project.status === 'pending'})}>{projectStatusMatrix[project.status]}</span></dd>
              </dl>
            </footer>
          </div>
        </article>
      </li>
    );
  },

  renderProjectList: function () {
    let { fetched, fetching, error, data } = this.props.projects;

    if (!fetched && !fetching) {
      return null;
    }

    if (fetching) {
      return null;
    }

    if (error) {
      return <div>Error: {prettyPrint(error)}</div>;
    }

    return (
      <ol className='card-list projects-card-list'>
        {data.results.map(o => this.renderProjectListItem(o))}
        <li>
          <button title={t('Create new project')} className='card__button card__button--add' type='button' onClick={this.openModal}><span>{t('New project')}</span></button>
        </li>
      </ol>
    );
  },

  render: function () {
    return (
      <section className='inpage inpage--hub'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>{t('Projects')}</h1>
            </div>
            <div className='inpage__actions'>
              <button title={t('Create new project')} className='ipa-plus' type='button' onClick={this.openModal}><span>{t('New project')}</span></button>
            </div>
          </div>
        </header>
        <div className='inpage__body'>
          <div className='inner'>
            {this.renderProjectList()}
          </div>
        </div>

        <ProjectFormModal
          _showGlobalLoading={showGlobalLoading}
          _hideGlobalLoading={hideGlobalLoading}
          revealed={this.state.projectFormModal}
          onCloseClick={this.closeModal}
          projectForm={this.props.projectForm}
          saveProject={this.props._postProject}
          resetForm={this.props._resetProjectFrom}
        />
      </section>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector (state) {
  return {
    projects: state.projects,
    projectForm: state.projectForm
  };
}

function dispatcher (dispatch) {
  return {
    _invalidateProjects: (...args) => dispatch(invalidateProjects(...args)),
    _fetchProjects: (...args) => dispatch(fetchProjects(...args)),
    _postProject: (...args) => dispatch(postProject(...args)),
    _resetProjectFrom: (...args) => dispatch(resetProjectFrom(...args))
  };
}

module.exports = connect(selector, dispatcher)(Home);
