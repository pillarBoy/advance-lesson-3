import React, { useEffect, useState } from 'react';
import { Form, Grid } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';

import KittyCards from './KittyCards';

export default function Kitties (props) {
  const { api, keyring } = useSubstrate();
  const accounts = keyring.getPairs();
  const { accountPair } = props;

  const [kittyCnt, setKittyCnt] = useState(0);
  const [kittyDNAs, setKittyDNAs] = useState([]);
  const [kittyOwners, setKittyOwners] = useState([]);
  const [kittyPrices, setKittyPrices] = useState([]);
  const [kitties, setKitties] = useState([]);
  const [status, setStatus] = useState('');

  // KittiesCount
  const fetchKittyCnt = () => {
    /* TODO: 加代码，从 substrate 端读取数据过来 */
    api.query.kitties?.kittiesCount(({words}) => {
      console.log('count', words);
      setKittyCnt(words[0])
    });
  };

  const fetchKitties = () => {
    /* TODO: 加代码，从 substrate 端读取数据过来 */
    if (accountPair) {
      let accountAddress = accounts.map((account) => account.address)

      api.query.kitties?.accountKitties.multi(accountAddress, (kittiesArray) => {
        let kitties = []
        // 构造前端需要的 kitties 数据结构
        kittiesArray.map((accountKitties, accountIds) => {
          if (accountKitties.length>0) {
            accountKitties = accountKitties.map(k => {
              k.address = accountAddress[accountIds]
              k.id = k[0].words[0]
              return k
            })
            kitties = [...kitties, ...accountKitties]
          }
        })
        setKitties(kitties)
      })
    }
  };

  const populateKitties = () => {
    /* TODO: 加代码，从 substrate 端读取数据过来 */
  };

  useEffect(fetchKittyCnt, [api, keyring]);
  useEffect(fetchKitties, [api, kittyCnt]);
  useEffect(populateKitties, [kittyDNAs, kittyOwners]);

  return <Grid.Column width={16}>
    <h1>小毛孩</h1>
    <KittyCards kitties={kitties} accountPair={accountPair} setStatus={setStatus}/>
    <Form style={{ margin: '1em 0' }}>
      <Form.Field style={{ textAlign: 'center' }}>
        <TxButton
          accountPair={accountPair} label='创建小毛孩' type='SIGNED-TX' setStatus={setStatus}
          attrs={{
            palletRpc: 'kitties',
            callable: 'create',
            inputParams: [],
            paramFields: []
          }}
        />
      </Form.Field>
    </Form>

    <div style={{ overflowWrap: 'break-word' }}>{status}</div>
  </Grid.Column>;
}
