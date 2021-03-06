import React from 'react';
import { Button, Card, Grid, Modal, Form } from 'semantic-ui-react';

import KittyAvatar from './KittyAvatar';
import { TxButton } from './substrate-lib/components';

// --- About Modal ---

const TransferModal = props => {
  const { kitty, accountPair, setStatus } = props;
  const [open, setOpen] = React.useState(false);
  const [formValue, setFormValue] = React.useState({});

  const formChange = key => (ev, el) => {
    /* TODO: 加代码 */
    setFormValue({ key: el.value });
  };

  const confirmAndClose = (unsub) => {
    unsub();
    setOpen(false);
  };

  return <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open}
    trigger={<Button disabled={ kitty.address !== accountPair.address } basic color='blue'>转让</Button>}>
    <Modal.Header>毛孩转让</Modal.Header>
    <Modal.Content><Form>
      <Form.Input fluid label='毛孩 ID' readOnly value={kitty.id}/>
      <Form.Input fluid label='转让对象' placeholder='对方地址' onChange={formChange('target')}/>
    </Form></Modal.Content>
    <Modal.Actions>
      <Button basic color='grey' onClick={() => setOpen(false)}>取消</Button>
      <TxButton
        accountPair={accountPair} label='确认转让' type='SIGNED-TX' setStatus={setStatus}
        onClick={confirmAndClose}
        attrs={{
          palletRpc: 'kitties',
          callable: 'transfer',
          inputParams: [formValue.target, kitty.id],
          paramFields: [true, true]
        }}
      />
    </Modal.Actions>
  </Modal>;
};

// --- About Kitty Card ---

const KittyCard = props => {
  /*
    TODO: 加代码。这里会 UI 显示一张 `KittyCard` 是怎么样的。这里会用到：
    ```
    <KittyAvatar dna={dna} /> - 来描绘一只猫咪
    <TransferModal kitty={kitty} accountPair={accountPair} setStatus={setStatus}/> - 来作转让的弹出层
    ```
  */
  const { dna, kitty, accountPair, setStatus } = props;

  return <Card color='pink'>
    <Card.Meta textAlign="right">
      {
        kitty.address === accountPair.address
          ? <span style={{ padding: '2px 4px', borderRadius: '5px 5px 0 0', background: '#ff00c5', color: 'white' }}>我的</span>
          : <span style={{ padding: '2px 4px' }}></span>
      }
    </Card.Meta>
    <KittyAvatar dna={dna} />
    <Card.Content>
      <div><strong>ID号: {kitty.id}</strong></div>
      <div style={{ fontSize: '12px', color: 'gray' }}>基因：</div>
      <p style={{ fontSize: '12px', color: 'gray' }}>{dna.join(', ')}</p>
      <div>猫奴：</div>
      <p style={{ wordBreak: 'break-all' }}>{kitty.address}</p>
    </Card.Content>
    <Card.Content textAlign="center">
      <TransferModal kitty={kitty} accountPair={accountPair} setStatus={setStatus}/>
    </Card.Content>
  </Card>;
};

const KittyCards = props => {
  const { kitties, accountPair, setStatus } = props;
  return <Grid columns={3} padded>
    {
      kitties && kitties.map(k => <Grid.Column key={k[0]}>
        <KittyCard dna={k[1]} kitty={k} accountPair={accountPair} setStatus={setStatus} />
      </Grid.Column>)
    }
  </Grid>;
};

export default KittyCards;
