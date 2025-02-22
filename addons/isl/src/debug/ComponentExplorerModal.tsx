/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {StyleXVar} from '@stylexjs/stylex/lib/StyleXTypes';

import {Banner, BannerKind} from '../Banner';
import {ErrorNotice} from '../ErrorNotice';
import {Link} from '../Link';
import {Tooltip} from '../Tooltip';
import {Badge} from '../components/Badge';
import {Button} from '../components/Button';
import {Checkbox} from '../components/Checkbox';
import {RadioGroup} from '../components/Radio';
import {Tag} from '../components/Tag';
import {T} from '../i18n';
import {layout} from '../stylexUtils';
import {colors, font, radius, spacing} from '../tokens.stylex';
import * as stylex from '@stylexjs/stylex';
import {
  VSCodeDivider,
  VSCodeDropdown,
  VSCodeOption,
  VSCodeTextArea,
  VSCodeTextField,
} from '@vscode/webview-ui-toolkit/react';
import {useState, type ReactNode} from 'react';
import {Icon} from 'shared/Icon';

const basicBgs = ['bg', 'subtleHoverDarken', 'hoverDarken'] as const;
const pureColors = ['red', 'yellow', 'orange', 'green', 'blue', 'purple', 'grey'] as const;
const scmColors = ['modifiedFg', 'addedFg', 'removedFg', 'missingFg'] as const;
const signalColors = ['signalGoodBg', 'signalMediumBg', 'signalBadBg'] as const;
const paddings = ['none', 'quarter', 'half', 'pad', 'double', 'xlarge'] as const;
const fontSizes = ['smaller', 'small', 'normal', 'big', 'bigger'] as const;

export default function ComponentExplorer(_: {dismiss: (_: unknown) => unknown}) {
  const [radioChoice, setRadioChoice] = useState('radio');
  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(true);
  return (
    <div {...stylex.props(styles.container)}>
      <h2>
        <T>Component Explorer</T>
      </h2>
      <div {...stylex.props(styles.container, layout.flexCol, layout.fullWidth)}>
        <GroupName>Colors</GroupName>
        <Row>
          {basicBgs.map(name => (
            <ColorBadge fg={colors.fg} bg={colors[name]} key={name}>
              {name}
            </ColorBadge>
          ))}
        </Row>
        <Row>
          {scmColors.map(name => (
            <ColorBadge fg={colors[name]} bg={colors.bg} key={name}>
              <Icon icon="diff-modified" />
              {name}
            </ColorBadge>
          ))}
        </Row>
        <Row>
          {pureColors.map(name => (
            <ColorBadge fg={colors[name]} bg={colors.bg} key={name}>
              {name}
            </ColorBadge>
          ))}
        </Row>
        <Row>
          {pureColors.map(name => (
            <ColorBadge fg={colors.fg} bg={colors[name]} key={name}>
              {name}
            </ColorBadge>
          ))}
        </Row>
        <Row>
          <ColorBadge fg={colors.errorFg} bg={colors.errorBg}>
            Error
          </ColorBadge>
          {signalColors.map(name => (
            <ColorBadge fg={colors.signalFg} bg={colors[name]} key={name}>
              {name}
            </ColorBadge>
          ))}
        </Row>
        <GroupName>Components</GroupName>
        <Row>
          <Button primary>Primary</Button>
          <Button disabled primary>
            Primary
          </Button>
          <Button>Secondary</Button>
          <Button disabled>Secondary</Button>
          <Button icon>Icon</Button>
          <Button icon>
            <Icon icon="rocket" />
            Icon
          </Button>
          <Button icon>
            <Icon icon="rocket" />
          </Button>
          <Button icon disabled>
            <Icon icon="rocket" /> Icon
          </Button>
          <Button>
            <Icon icon="rocket" /> Secondary With Icon
          </Button>
          <VSCodeDropdown>
            <VSCodeOption>Dropdown</VSCodeOption>
            <VSCodeOption>Option</VSCodeOption>
          </VSCodeDropdown>
        </Row>
        <Row>
          <Checkbox checked={checkbox1} onChange={setCheckbox1}>
            Checkbox
          </Checkbox>
          <Checkbox checked={checkbox2} onChange={setCheckbox2}>
            Checked
          </Checkbox>
          <RadioGroup
            choices={[
              {title: 'Radio', value: 'radio'},
              {title: 'Another', value: 'another'},
            ]}
            current={radioChoice}
            onChange={setRadioChoice}
          />
        </Row>
        <Row>
          <Badge>Badge</Badge>
          <Badge>0</Badge>
          <Tag>Tag</Tag>
          <Tag>0</Tag>
          <Link href={'#'}>Link</Link>
          <Icon icon="loading" />
          Loading
        </Row>
        <VSCodeDivider />
        <Row>
          <VSCodeTextArea placeholder="placeholder">Text area</VSCodeTextArea>
          <VSCodeTextField placeholder="placeholder">Text Field</VSCodeTextField>
          <Tooltip trigger="manual" shouldShow={true} title="Tooltip" placement="bottom">
            Thing
          </Tooltip>
        </Row>

        <Row>
          <Banner>Banner</Banner>
          <Banner kind={BannerKind.warning}>Warning Banner</Banner>
          <Banner kind={BannerKind.error}>Error Banner</Banner>
          <Banner icon={<Icon icon="info" />}>Icon Banner</Banner>
        </Row>
        <Row>
          <ErrorNotice
            title="Error Notice"
            description="description"
            details="details / stack trace"
          />
        </Row>
        <GroupName>Spacing</GroupName>
        <Row>
          {paddings.map(size => (
            <ColorBadge style={styles.padding(size)} key={size}>
              {size}
            </ColorBadge>
          ))}
        </Row>
        <Row>
          <div {...stylex.props(layout.flexCol)} style={{alignItems: 'flex-start'}}>
            {paddings.map(size => (
              <div {...stylex.props(layout.flexRow)} style={{gap: spacing[size]}}>
                <ColorBadge>A</ColorBadge>
                <ColorBadge>B</ColorBadge>
                <ColorBadge>{size}</ColorBadge>
              </div>
            ))}
          </div>
        </Row>
        <GroupName>Font</GroupName>
        <Row>
          {fontSizes.map(size => (
            <ColorBadge style={styles.font(size)} bg={colors.hoverDarken} key={size}>
              {size}
            </ColorBadge>
          ))}
        </Row>
      </div>
    </div>
  );
}

const styles = stylex.create({
  container: {
    padding: spacing.pad,
    overflow: 'auto',
  },
  badge: (fg, bg) => ({
    backgroundColor: bg,
    color: fg,
    fontFamily: 'monospace',
    paddingBlock: spacing.half,
    paddingInline: spacing.pad,
    borderRadius: radius.round,
  }),
  groupName: {
    fontSize: font.bigger,
    width: '100%',
    paddingTop: spacing.double,
    fontWeight: 'bold',
  },
  padding: (pad: (typeof paddings)[number]) => ({
    padding: spacing[pad],
  }),
  font: (size: (typeof fontSizes)[number]) => ({
    fontSize: font[size],
  }),
});

function ColorBadge({
  children,
  bg,
  fg,
  style,
}: {
  children: ReactNode;
  bg?: StyleXVar<string>;
  fg?: StyleXVar<string>;
  style?: stylex.StyleXStyles;
}) {
  return (
    <div {...stylex.props(layout.flexRow, styles.badge(fg, bg ?? colors.hoverDarken), style)}>
      {children}
    </div>
  );
}

function Row({children, style}: {children: ReactNode; style?: stylex.StyleXStyles}) {
  return <div {...stylex.props(layout.flexRow, layout.fullWidth, style)}>{children}</div>;
}

function GroupName({children}: {children: ReactNode}) {
  return <div {...stylex.props(styles.groupName)}>{children}</div>;
}
