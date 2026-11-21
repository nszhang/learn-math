import { useMemo, useState } from 'react';
import Medallion from './Medallion.jsx';
import { searchSkills } from '../skillSearch.js';
import { useNavState } from '../nav.js';
import { clickable } from '../a11y.js';

const SHOW = 10;

/* "What do you want to practice?" — finds skills in one subject for a topic in plain words. */
export default function SkillSearch({ subject, myGrade, scoreOf, hwSkills, onPick }) {
  // kept on the history entry, so coming Back from practice shows the same results
  const [query, setQuery] = useNavState('search:' + subject.id, '');
  const [showAll, setShowAll] = useState(false);
  const found = useMemo(() => searchSkills(subject, query, { myGrade }), [subject, query, myGrade]);
  const { results, partial, terms } = found;
  const shown = showAll ? results : results.slice(0, SHOW);
  const typed = query.trim().length > 0;

  return (
    <div className="skill-search">
      <input type="search" className="skill-search-input" value={query} aria-label={`Search ${subject.name} skills`}
        placeholder={subject.id === 'math' ? '🔍 What do you want to practice? e.g. "similar triangles"' : `🔍 What do you want to practice in ${subject.name}?`}
        onChange={e => { setQuery(e.target.value, { replace: true }); setShowAll(false); }} />
      {typed && (
        <div className="skill-search-results">
          <p className="muted skill-search-summary">
            {!terms.length ? 'Tell me a topic, like "fractions" or "scale factor".'
              : !results.length ? <>No {subject.name.toLowerCase()} skills match — try fewer or different words.</>
              : partial ? <>No skill matches every word — here are the closest {results.length}:</>
              : <>{results.length}{results.length === 40 ? '+' : ''} skill{results.length === 1 ? '' : 's'} to practice{myGrade !== null ? ' — your grade first' : ''}:</>}
          </p>
          {shown.map(r => (
            <div className="skill-row" key={r.skill.id} {...clickable(() => onPick(r.skill.id))}>
              <span className="skill-code">{r.grade.name} · {r.skill.code}</span>
              <span className="skill-name">{r.skill.title}<span className="skill-search-section muted"> · {r.section.name}</span></span>
              {hwSkills.has(r.skill.id) && <span className="hw-tag">📝 HW</span>}
              <Medallion score={scoreOf(r.skill.id)} />
            </div>
          ))}
          {results.length > SHOW && !showAll && (
            <button type="button" className="btn btn-ghost skill-search-more" onClick={() => setShowAll(true)}>
              Show all {results.length}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
