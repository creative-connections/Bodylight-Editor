export class BodylightEditorItems {
  basicitems = [
    {
      name: 'bdl-fmi',
      doc: 'fmi.md',
      def: '<bdl-fmi id="idfmi" src="" ' +
        'fminame="" tolerance="0.000001" starttime="0" ' +
        'guid=""' +
        'valuereferences=""' +
        'valuelabels=""' +
        'inputs=""></bdl-fmi>',
      dialog: './attribute-fmi-dialog'
    },
    {
      name: 'bdl-animate-adobe',
      doc: 'adobe.md',
      def: '<bdl-animate-adobe' +
        '    src=""' +
        '    width="800"' +
        '    height="600"' +
        '    name=""' +
        '    fromid="idfmi" ></bdl-animate-adobe> \n',
      dialog: './attribute-adobe-dialog'
    },
    {
      name: 'bdl-bind2a',
      doc: 'adobe.md',
      def: '<bdl-bind2a \n' +
        'findex="0" \n' +
        'aname="" \n' +
        'amin="0" \n' +
        'amax="100" \n' +
        'fmin="0.5" \n' +
        'fmax="1.5"\n' +
        '></bdl-bind2a>',
      dialog: './attribute-bind2a-dialog'
    },
    {
      name: 'bdl-bind2a-text',
      doc: 'adobe.md',
      def: '<bdl-bind2a-text \n' +
        'findex="0" \n' +
        'aname="" \n' +
        '></bdl-bind2a-text>',
      dialog: './attribute-bind2a-text-dialog'
    },
    {
      name: 'bdl-chartjs-time',
      doc: 'chartjs.md',
      def: '<bdl-chartjs-time  \n' +
        '  id="id10" \n' +
        '  width="300" \n' +
        '  height="200" \n' +
        '  fromid="idfmi" \n' +
        '  labels=""\n' +
        '  initialdata="" \n' +
        '  refindex="0"   \n' +
        '  refvalues="1"></bdl-chartjs-time>'
    },
    {
      name: 'bdl-plotly',
      doc: 'plotly.md',
      def: '<bdl-plotly\n' +
        '  fromid="fmiid"\n' +
        '  refindex="0"\n' +
        '  refvalues="2"\n' +
        '  maxdata="255"\n' +
        '  width="600"\n' +
        '  height="300"\n' +
        '  convertors="x/133.32;1,60"></bdl-plotly>'
    }];
  advanceditems=[
    {
      name: 'bdl-range',
      doc: 'range.md',
      def: '<bdl-range id="id1" title="" min="0" max="10" default="5" step="1" maxlength="2"></bdl-range>'
    },
    {
      name: 'bdl-value',
      doc: 'value.md',
      def: '<bdl-value fromid="idfmi" refindex="8"></bdl-value>'
    },
    {
      name: 'bdl-bind2previous',
      doc: 'bind.md',
      def: '<bdl-bind2previous fromid="id3" toid="id2"></bdl-bind2previous>'
    },
    {
      name: 'bdl-receptacle',
      doc: 'receptacle.md',
      def: '<bdl-receptacle id="id10" hx="100" hy="100" px="50" py="50" value="50"></bdl-receptacle>'
    },
    {
      name: 'bdl-animate-gif',
      doc: 'animate.md',
      def: '<bdl-animate-gif fromid="idfmi" src="somefile.gif"></bdl-animate-gif>'
    },
    {
      name: 'bdl-animate-control',
      doc: 'animate.md',
      def: '<bdl-animate-control id="idanimate" speedfactor="50"></bdl-animate-control>\n'
    },
    {
      name: 'bdl-animate-control S',
      doc: 'animate.md',
      def: '<bdl-animate-control \n' +
        'id="id4" \n' +
        'speedfactor="20" \n' +
        'segments="3;5;14;17;29" \n' +
        'segmentlabels="4b plnění atriální systola;1 systola komor - isovolumická kontrakce;2 systola komor - ejekce;3 isovolumická relaxace;4a plnění"></bdl-animate-control>\n'
    }, {
      name: 'bdl-audio-on-increase',
      doc: 'audio.md',
      def: '<bdl-audio-on-increase src="doc/monitor-beep.mp3" thresholdvalue="1e+7" fromid="idfmi" refindex="8">\n' +
        '</bdl-audio-on-increase>\n'
    }, {
      name: 'bdl-audio-on-decrease',
      doc: 'audio.md',
      def: '<bdl-audio-on-decrease src="doc/monitor-beep.mp3" thresholdvalue="1e+7" fromid="idfmi" refindex="8">\n' +
        '</bdl-audio-on-decrease>'
    }, {
      name: 'bdl-sound-on-increase',
      doc: 'audio.md',
      def: '<bdl-sound-on-increase \n' +
        '  thresholdvalue="1e+7" fromid="idfmi" refindex="8" freq="440" volume="0.3">\n' +
        '</bdl-sound-on-increase> \n'
    }, {
      name: 'bdl-sound-on-decrease',
      doc: 'audio.md',
      def: '<bdl-sound-on-decrease \n' +
        '  thresholdvalue="1e+7" fromid="idfmi" refindex="8" freq="440" volume="0.3">\n' +
        '</bdl-sound-on-decrease> \n'
    }, {
      name: 'bdl-beaker',
      doc: 'beaker.md',
      def: '<bdl-beaker bwidth="10" bheight="50" id="id8" color="pink" width="100" height="100"></bdl-beaker>'
    }, {
      name: 'bdl-beakercontrols',
      doc: 'beaker.md',
      def: '<bdl-beakercontrols bwidth="10" bwidthmin="5" bwidthmax="100" bheight="50" bheightmin="10" bheightmax="100" id="id8" color="pink" width="100" height="100"></bdl-beakercontrols>'
    }, {
      name: 'bdl-chartjs-time',
      doc: 'chartjs.md',
      def: '<bdl-chartjs-time  \n' +
        '  id="id10" \n' +
        '  width="300" \n' +
        '  height="200" \n' +
        '  fromid="idfmi" \n' +
        '  labels=""\n' +
        '  initialdata="" \n' +
        '  refindex="2"   \n' +
        '  refvalues="6"></bdl-chartjs-time>'
    }, {
      name: 'bdl-chartjs',
      doc: 'chartjs.md',
      def: '<bdl-chartjs \n' +
        '  id="id9" \n' +
        '  width="300" \n' +
        '  height="500" \n' +
        '  fromid="idfmi" \n' +
        '  type="doughnut" \n' +
        '  labels="Intrathoracic Arteries,ExtraThoracic Arteries, Pulmonary Arteries, Intrathoracic Veins, Extrathoracic veins, Pulmonary Veins"\n' +
        '  initialdata="0,4,2,3" \n' +
        '  refindex="2" \n' +
        '  refvalues="6"></bdl-chartjs>\n'
    }, {
      name: 'bdl-chartjs-xy',
      doc: 'chartjs.md',
      def: '<bdl-chartjs-xy id="id10" width="400" height="400" fromid="idfmi" \n' +
        'labels="Pressure in Left Ventricle, Left Ventricle Volume" \n' +
        'initialdata=";;0,0.00015;0,28000;0,0.00015;0,1400" \n' +
        'refindex="0" refvalues="2"></bdl-chartjs-xy>\n'
    }, {
      name: 'bdl-ecg',
      doc: 'ecg.md',
      def: '<bdl-ecg \n' +
        '  id="id11" \n' +
        '  fromid="idfmi"\n' +
        '  labels="ECG I (mV)"\n' +
        '  width="300"\n' +
        '  height="50"></bdl-ecg>\n'
    }, {
      name: 'bdl-quiz',
      doc: 'quiz.md',
      def: '<bdl-quiz question="Question :"' +
        '  answers="answer 1 (separated by pipe) | answer 2"' +
        '  correctoptions="false|true"' +
        '  explanations="explanation why answer 1 is false (separated by pipe)|explanation why answer 2 is true">' +
        '</bdl-quiz>'
    }/* this is for webapp project type,{
    name:"bdl-markdown",
      doc:"markdown.md",
      def:"<bdl-markdown src=\"[filename.md]\" watchhash=\"true|false\"></bdl-markdown>"
    },{
    name:"bdl-markdown-book",
      doc:"markdown.md",
      def:"    <bdl-markdown-book index=\"doc/index.md\" summary=\"doc/summary.md\">\n" +
        "      <img src=\"loading.gif\"/>\n" +
        "    </bdl-markdown-book>\n"
    }*/
  ]
}
