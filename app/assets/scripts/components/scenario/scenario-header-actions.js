'use strict';
import React, { PropTypes as T } from 'react';
import c from 'classnames';
import ReactTooltip from 'react-tooltip';

import Dropdown from '../dropdown';
import { t } from '../../utils/i18n';

import ScenarioDeleteAction from './scenario-delete-action';

const ScenarioHeaderActions = React.createClass({

  propTypes: {
    onAction: T.func,
    scenario: T.object
  },

  onGenerateClick: function (isActive, e) {
    isActive && this.props.onAction('generate', e);
  },

  onEditClick: function (isActive, e) {
    isActive && this.props.onAction('edit-network', e);
  },

  renderDisableReatonTip: function (isGenerating, isPending) {
    let disable = !isGenerating && !isPending;
    let txt;

    if (isGenerating) {
      txt = t('Generation is in progress.');
    } else if (isPending) {
      txt = t('Scenario still being created.');
    }

    return (
      <ReactTooltip id='tip-disable-reason' effect='solid' disable={disable}>
        {txt}
      </ReactTooltip>
    );
  },

  render: function () {
    let isGenerating = this.props.scenario.gen_analysis && this.props.scenario.gen_analysis.status === 'running';
    let isMaster = this.props.scenario.master;
    let isPending = this.props.scenario.status === 'pending';

    return (
      <div className='inpage__actions'>
        <Dropdown
          onChange={(open) => open ? ReactTooltip.rebuild() : ReactTooltip.hide()}
          className='scenario-meta-menu'
          triggerClassName='ipa-ellipsis'
          triggerActiveClassName='button--active'
          triggerText='Action'
          triggerTitle='Action'
          direction='down'
          alignment='center' >
            <ul className='drop__menu drop__menu--iconified' role='menu'>
              <li><a href='#' title={t('Edit metadata')} className='drop__menu-item dmi-pencil' data-hook='dropdown:close' onClick={this.props.onAction.bind(null, 'edit-metadata')}>{t('Edit metadata')}</a></li>
              <li><a href='#' title={t('Duplicate scenario')} className='drop__menu-item dmi-copy' data-hook='dropdown:close' onClick={this.props.onAction.bind(null, 'duplicate')}>{t('Duplicate scenario')}</a></li>
            </ul>
            <ul className='drop__menu drop__menu--iconified' role='menu'>
              <li><ScenarioDeleteAction isMaster={isMaster} name={this.props.scenario.name} onDeleteConfirm={this.props.onAction.bind(null, 'delete')}/></li>
            </ul>
        </Dropdown>
        <button data-tip data-for='tip-disable-reason' title={t('Edit network')} className={c('ipa-pencil', {'visually-disabled': isGenerating || isPending})} type='button' onClick={this.onEditClick.bind(null, !isGenerating)}><span>{t('Edit')}</span></button>
        <button data-tip data-for='tip-soon' title={t('Download results')} className='ipa-download visually-disabled' type='button' onClick={this.props.onAction.bind(null, 'download-results')}><span>{t('Download')}</span></button>

        <button data-tip data-for='tip-disable-reason' title={t('Generate results')} className={c('ipa-arrow-loop', {'visually-disabled': isGenerating || isPending})} type='button' onClick={this.onGenerateClick.bind(null, !isGenerating)}><span>{t('Generate')}</span></button>

        {this.renderDisableReatonTip(isGenerating, isPending)}

        <ReactTooltip id='tip-soon' effect='solid'>
          {t('Coming soon...')}
        </ReactTooltip>

      </div>
    );
  }
});

export default ScenarioHeaderActions;
