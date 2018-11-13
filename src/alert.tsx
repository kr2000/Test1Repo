import * as React from 'react';

import { getStyles, IButtonBasicExampleStyleProps, IButtonBasicExampleStyles } from 'office-ui-fabric-react/lib/components/Button/examples/Button.Basic.Example.styles';

import { DefaultButton, IButtonProps, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Label } from 'office-ui-fabric-react/lib/Label';

import { classNamesFunction, css } from 'office-ui-fabric-react/lib/Utilities';

class ButtonDefaultExample extends React.Component<IButtonProps, {}> {
  public render(): JSX.Element {
    const { disabled, checked } = this.props;

    const getClassNames = classNamesFunction<IButtonBasicExampleStyleProps, IButtonBasicExampleStyles>();
    const classNames = getClassNames(getStyles, {});

    return (
      <div className={css(classNames.twoup)}>
        <div>
          <Label>Standard</Label>
          <DefaultButton
            data-automation-id="test"
            allowDisabledFocus={true}
            disabled={disabled}
            checked={checked}
            text="Button"
            onClick={this._alertClicked}
          />
        </div>
        <div>
          <Label>Primary</Label>
          <PrimaryButton
            data-automation-id="test"
            disabled={disabled}
            checked={checked}
            text="Button"
            onClick={this._alertClicked}
            allowDisabledFocus={true}
          />
        </div>
      </div>
    );
  }

  private _alertClicked(): void {
    alert('Clicked');
  }
}

export default ButtonDefaultExample;