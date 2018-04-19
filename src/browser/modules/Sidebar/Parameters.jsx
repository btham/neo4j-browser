/*
 * Copyright (c) 2002-2017 "Neo4j, Inc,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { connect } from 'preact-redux'
import * as actions from 'shared/modules/settings/settingsDuck'
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerSection,
  DrawerSectionBody,
  DrawerSubHeader
} from 'browser-components/drawer'
import { RadioSelector, CheckboxSelector } from 'browser-components/Form'
import {
  StyledSetting,
  StyledSettingLabel,
  StyledSettingTextInput
} from './styled'

const visualSettings = [
  {
    title: 'Movement Dates',
    settings: [
      {
        fromDate: {
          displayName: 'From Date yyyymmdd',
          tooltip: 'Trace animals movement from date'
        }
      },
      {
        toDate: {
          displayName: 'To Date yyyymmdd',
          tooltip: 'Trace animals movement to date'
        }
      }
    ]
  }
]

export const Parameters = ({ settings, onSettingsSave = () => {} }) => {
  if (!settings) return null
  const mappedSettings = visualSettings.map((visualSetting, i) => {
    const title = <DrawerSubHeader>{visualSetting.title}</DrawerSubHeader>
    const mapSettings = visualSetting.settings
      .map((settingObj, i) => {
        const setting = Object.keys(settingObj)[0]
        if (typeof settings[setting] === 'undefined') return false
        const visual = settingObj[setting].displayName
        const tooltip = settingObj[setting].tooltip || ''

        if (!settingObj[setting].type || settingObj[setting].type === 'input') {
          return (
            <StyledSetting key={i}>
              <StyledSettingLabel title={tooltip}>{visual}</StyledSettingLabel>
              <StyledSettingTextInput
                onChange={event => {
                  settings[setting] = event.target.value
                  onSettingsSave(settings)
                }}
                defaultValue={settings[setting]}
                title={[tooltip]}
                className={setting}
              />
            </StyledSetting>
          )
        } else if (settingObj[setting].type === 'radio') {
          return (
            <StyledSetting key={i}>
              <StyledSettingLabel title={tooltip}>{visual}</StyledSettingLabel>
              <RadioSelector
                options={settingObj[setting].options}
                onChange={event => {
                  settings[setting] = event.target.value
                  onSettingsSave(settings)
                }}
                selectedValue={settings[setting]}
              />
            </StyledSetting>
          )
        } else if (settingObj[setting].type === 'checkbox') {
          return (
            <StyledSetting key={i}>
              <CheckboxSelector
                onChange={event => {
                  settings[setting] = event.target.checked
                  onSettingsSave(settings)
                }}
                checked={settings[setting]}
              />
              <StyledSettingLabel title={tooltip}>{visual}</StyledSettingLabel>
            </StyledSetting>
          )
        }
      })
      .filter(setting => setting !== false)
    return (
      <div>
        {title}
        {mapSettings}
      </div>
    )
  })

  return (
    <Drawer id='db-settings'>
      <DrawerHeader>Cow Catcher Params</DrawerHeader>
      <DrawerBody>
        <DrawerSection>
          <DrawerSectionBody>{mappedSettings}</DrawerSectionBody>
        </DrawerSection>
      </DrawerBody>
    </Drawer>
  )
}

const mapStateToProps = state => {
  return {
    settings: state.settings
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSettingsSave: settings => {
      dispatch(actions.update(settings))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Parameters)
