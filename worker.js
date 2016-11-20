import krkrsvchk from 'krkrsvchk';

const reader = new FileReaderSync;
const message = {};
message[krkrsvchk.OK]           = '正常なセーブデータです。';
message[krkrsvchk.BYTE_CODE]    = 'バイトコードファイルです。危険なTJSスクリプトが含まれている可能性があります。';
message[krkrsvchk.FORMAT_ERROR] = 'ファイルの解析に失敗しました。セーブデータではないか、セーブデータがゲームの独自形式の可能性があります。';
message[krkrsvchk.PARSE_ERROR]  = 'ファイルの解析に失敗しました。セーブデータに危険なTJSスクリプトが含まれている可能性があります。';
message[krkrsvchk.MACRO]        = 'マクロが含まれています。マクロの中に危険なKAGスクリプトが含まれている可能性があります。';

onmessage = event => {
  const files = event.data;
  for (let i=0; i<files.length; i++) {
    try {
      const data = new Uint8Array(reader.readAsArrayBuffer(files[i]));
      const result = krkrsvchk.check(data);
      postMessage({
        id: i,
        ok: result.code==krkrsvchk.OK,
        result: message[result.code] || result.code,
        detail: result.detail,
      });
    } catch (e) {
      postMessage({
        id: i,
        ok: false,
        result: 'error',
        detail: e.toString(),
      });
    }
  }
};
