export class BodylightEditorItems {
  items = [{
    name: 'bdl-range',
    doc: 'range.md',
    def: '<bdl-range min="0" max="10" default="5" step="1"></bdl-range>'
  },
  {
    name: 'bdl-value',
    doc: 'value.md',
    def: '<bdl-value fromid="id4" refindex="8"></bdl-value>'
  },
  {
    name: 'bdl-fmi',
    doc: 'fmi.md',
    def: '<bdl-fmi id="id4" src="MeursFMI2.js" fminame="Physiolibrary_Hydraulic_Examples_MeursModel2011_HemodynamicsMeurs_0flatNorm"   tolerance="0.000001" starttime="0" guid="{b3a357a4-da8c-4f00-b159-28ec2ea45e26}"\n               valuereferences="637534281,637534272,33554436, 33554437, 33554432, 33554436, 33554437, 33554433, 16777313"\n               valuelabels="Pressure in Aorta,Pressure in Left Ventricle, Intrathoracic Artery Volume, Extrathoracic Arteries Volume, Pulmonary Arteries Volume, Intrathoracic Veins Volume, Extrathoracic Veins volume, Pulmonary Veins Volume,Heart Rate"\n               inputs="id1,16777313,1,60"></bdl-fmi>',
    dialog: './attribute-fmi-dialog'
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
    def: '<bdl-animate-gif fromid="id4" src="doc/heart.gif"></bdl-animate-gif>'
  },
  {
    name: 'bdl-animate-control',
    doc: 'animate.md',
    def: '<bdl-animate-control id="id4" speedfactor="50"></bdl-animate-control>\n'
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
    def: '<bdl-audio-on-increase src="doc/monitor-beep.mp3" thresholdvalue="1e+7" fromid="id4" refindex="8">\n' +
        '</bdl-audio-on-increase>\n'
  }, {
    name: 'bdl-audio-on-decrease',
    doc: 'audio.md',
    def: '<bdl-audio-on-decrease src="doc/monitor-beep.mp3" thresholdvalue="1e+7" fromid="id4" refindex="8">\n' +
        '</bdl-audio-on-decrease>'
  }, {
    name: 'bdl-sound-on-increase',
    doc: 'audio.md',
    def: '<bdl-sound-on-increase \n' +
        '  thresholdvalue="1e+7" fromid="id4" refindex="8" freq="440" volume="0.3">\n' +
        '</bdl-sound-on-increase> \n'
  }, {
    name: 'bdl-sound-on-decrease',
    doc: 'audio.md',
    def: '<bdl-sound-on-decrease \n' +
        '  thresholdvalue="1e+7" fromid="id4" refindex="8" freq="440" volume="0.3">\n' +
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
        '  height="500" \n' +
        '  fromid="id4" \n' +
        '  labels="Pressure in Aorta,Pressure in Left Ventricle, Intrathoracic Artery Volume, Extrathoracic Arteries Volume, Pulmonary Arteries Volume, Intrathoracic Veins Volume"\n' +
        '  initialdata="0,1,2,3,4;2,2,2,2;3,2,4;1,5,3;2,2,3,2" \n' +
        '  refindex="2"   \n' +
        '  refvalues="6"></bdl-chartjs-time>'
  }, {
    name: 'bdl-chartjs',
    doc: 'chartjs.md',
    def: '<bdl-chartjs \n' +
        '  id="id9" \n' +
        '  width="300" \n' +
        '  height="500" \n' +
        '  fromid="id4" \n' +
        '  type="doughnut" \n' +
        '  labels="Intrathoracic Arteries,ExtraThoracic Arteries, Pulmonary Arteries, Intrathoracic Veins, Extrathoracic veins, Pulmonary Veins"\n' +
        '  initialdata="0,4,2,3" \n' +
        '  refindex="2" \n' +
        '  refvalues="6"></bdl-chartjs>\n'
  }, {
    name: 'bdl-chartjs-xy',
    doc: 'chartjs.md',
    def: '<bdl-chartjs-xy id="id10" width="400" height="400" fromid="id4" \n' +
        'labels="Pressure in Left Ventricle, Left Ventricle Volume" \n' +
        'initialdata=";;0,0.00015;0,28000;0,0.00015;0,1400" \n' +
        'refindex="0" refvalues="2"></bdl-chartjs-xy>\n'
  }, {
    name: 'bdl-ecg',
    doc: 'ecg.md',
    def: '<bdl-ecg \n' +
        '  id="id11" \n' +
        '  fromid="id4"\n' +
        '  labels="ECG I (mV)"\n' +
        '  width="300"\n' +
        '  height="50"></bdl-ecg>\n'
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
