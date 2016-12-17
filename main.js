import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import muiThemeable from 'material-ui/styles/muiThemeable';
import {CircularProgress, AppBar, Card, CardHeader, CardText, Avatar} from 'material-ui';
import Done from 'material-ui/svg-icons/action/done';
import Error from 'material-ui/svg-icons/alert/error';
import {red500, green500, yellow50, grey700, blueGrey500, grey300} from 'material-ui/styles/colors';
import Worker from 'worker?name=worker.js!./worker.js';

// http://www.material-ui.com/#/get-started/installation
injectTapEventPlugin();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleFiles = this.handleFiles.bind(this);
    this.state = {
      files: [],
      drag: false,
    };
    this.worker = Worker();
  }

  handleFiles(files) {
    var f = [];
    for (var t of files)
      f.push({name: t.name});
    this.setState({files: f});

    this.worker.terminate();
    this.worker = new Worker();
    this.worker.postMessage(files);
    this.worker.onmessage = event => {
      const result = event.data;
      this.setState(prevState => {
        const files = prevState.files;
        files[result.id].ok = result.ok;
        files[result.id].result = result.result;
        files[result.id].detail = result.detail;
        this.setState({files: files});
      });
    };
  }

  render() {
    return (
      <div>
        <AppBar
          title="吉里吉里2/KAG3セーブデータチェッカー"
          showMenuIconButton={false} />

        <div style={{margin: '1em', lineHeight: '1.2em'}}>
          <p>
            吉里吉里2/KAG3のセーブデータに危険なスクリプトが含まれていないかを調べます。<br />
            *.kdtもしくは*.ksdファイルを下のフォームにドロップしてください。複数のファイルに対応しています。<br />
            セーブデータはブラウザ内で解析しています。サーバーにファイルの内容が送信されることはありません。
          </p>
          <p>
            サムネイル画像を含んだセーブデータを使用するゲームの栞データには対応していません。<br />
            正常な栞データは本ツールでエラーになります。本ツールで正常と判定されたセーブデータでも、栞データとして読み込ませると危険なスクリプトが実行される可能性があります。<br />
            システム変数データ（sc.ksd, su.ksd）には対応しています。
          </p>
          <p>
            セーブデータの解析処理はnpmのライブラリとして公開しており、コマンドラインから実行することも可能です。<br />
            <a href="https://www.npmjs.com/package/krkrsvchk">https://www.npmjs.com/package/krkrsvchk</a>
          </p>
          <p>
            <a href="https://twitter.com/kusano_k">@kusano_k</a>
          </p>
        </div>

        <div
          onDragEnter={event => {
            event.stopPropagation();
            event.preventDefault();
            this.setState({drag: true});
          }}
          onDragOver={event => {
            event.stopPropagation();
            event.preventDefault();
          }}
          onDragLeave={event => {
            this.setState({drag: false});
          }}
          onDrop={event => {
            event.stopPropagation();
            event.preventDefault();
            this.setState({drag: false});
            if (event.dataTransfer.files)
              this.handleFiles(event.dataTransfer.files);
          }}
          onClick={event => {
            event.stopPropagation();
            event.preventDefault();
            document.getElementById('input').click();
          }}
          style={{
            margin: '1em',
            padding: '1em',
            height: '6em',
            lineHeight: '1.2em',
            borderStyle: 'solid',
            borderWidth: this.state.drag ? '4px' : '2px',
            borderRadius: '6px',
            borderColor: this.state.drag ? this.props.muiTheme.palette.primary1Color : grey300,
            transition: 'all 100ms 0s ease',
            color: grey700,
            cursor: 'pointer',
          }}>
          ファイルをここにドロップしてください。<br />
          ここをクリックすると、ファイル選択ダイアログを開きます。
        </div>

        <form style={{display: 'none'}}>
          <input id="input" type="file" onChange={event=>this.handleFiles(event.target.files)} multiple/>
        </form>

        {this.state.files.map((f, i) => (
          <Card
            key={i}
            style={{
              margin: '1em',
              background: f.ok==false ? yellow50 : undefined,
            }}>
            <CardHeader
              title={f.name}
              style={{paddingBottom: 0}}
              avatar={
                f.ok==undefined ? undefined :
                f.ok ? <Done color={green500} /> :
                <Error color={red500} />
              } />
            <CardText>
              {f.ok==undefined ?
                <CircularProgress />
              :
                <div>
                  <div>{f.result}</div>
                  <pre style={{color: grey700}}>{f.detail}</pre>
                </div>
              }
            </CardText>
          </Card>
        ))}
      </div>
    );
  }
}

App = muiThemeable()(App);

ReactDOM.render(
  <MuiThemeProvider
    muiTheme={getMuiTheme({
      palette: {
        primary1Color: blueGrey500,
      },
    })}>
    <App />
  </MuiThemeProvider>,
  document.getElementById('root')
);
