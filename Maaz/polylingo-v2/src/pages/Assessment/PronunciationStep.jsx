import { useState, useRef } from 'react'
import { useAssessment } from './assessmentContext'

export default function PronunciationStep() {
  const { update, goNext, goPrev } = useAssessment()
  const [recording, setRecording] = useState(false)
  const [time, setTime] = useState(0)
  const timer = useRef(null)
  const bars  = useRef([])
  const fmt = s => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`

  function start() {
    setRecording(true); let s=0
    timer.current = setInterval(() => {
      s++; setTime(s)
      bars.current.forEach(b => { if(b) b.style.height=`${Math.random()*80+10}px` })
      if(s>=30) stop()
    }, 1000)
  }
  function stop() {
    clearInterval(timer.current); setRecording(false)
    bars.current.forEach(b => { if(b) b.style.height='4px' })
  }
  function cont() { update({pronunciationScore: Math.floor(Math.random()*3)+7}); goNext('pronunciation') }

  return (
    <div className="test-container fade-in" style={{margin:'2rem auto'}}>
      <div className="test-header">
        <h2>Pronunciation Assessment</h2>
        <p>Read the following sentences aloud. We'll analyze your pronunciation accuracy.</p>
      </div>
      <div className="test-content">
        <div className="speaking-test">
          <div className="speaking-prompt">
            "The quick brown fox jumps over the lazy dog. She sells seashells by the seashore. How much wood would a woodchuck chuck if a woodchuck could chuck wood?"
          </div>
          <div className="recording-section">
            <div className="recording-visualizer" id="pronunciationVisualizer">
              {Array.from({length:30}).map((_,i) => <div key={i} ref={el=>bars.current[i]=el} className="visualizer-bar" style={{height:'4px'}}/>)}
            </div>
            <div className="timer-display" id="pronunciationTimer">{fmt(time)}</div>
            <div className="recording-controls">
              <button className={`record-btn${recording?' recording':''}`} onClick={recording?stop:start}>
                <i className={`fas ${recording?'fa-stop':'fa-microphone'}`}/>
              </button>
            </div>
            <p style={{color:'var(--gray)',marginTop:'1rem',textAlign:'center'}}>
              {recording ? 'Recording... click stop when done.' : 'Speak clearly into your microphone. Try to pronounce each word accurately.'}
            </p>
          </div>
        </div>
      </div>
      <div className="test-navigation">
        <button className="btn btn-outline" onClick={()=>goPrev('pronunciation')}><i className="fas fa-arrow-left"/> Back</button>
        <button className="btn btn-primary" onClick={cont}>Continue to Speaking Test <i className="fas fa-arrow-right"/></button>
      </div>
    </div>
  )
}
