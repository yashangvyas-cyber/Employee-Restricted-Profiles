# PROGRESS

Per `CollabCrawl/CLAUDE.md` → "THE FORM/SCREEN WORKFLOW". One section per
session; run the gate before committing.

## Gate

```bash
cd ~/.gemini/antigravity/scratch/CollabCrawl
node   _tools/emp_fieldmap.cjs                          # real app  -> add_fieldmap.json
node   _tools/emp_fieldmap.cjs http://localhost:5175 built_fieldmap.json
python3 _tools/diff_fieldmaps.py _tools/emp_out2/add_fieldmap.json \
                                 _tools/emp_out2/built_fieldmap.json
```

One extractor, both sides — that is what makes it trustworthy. Earlier gates
compared a static dump against a rendered page and the parser mismatch hid real
errors for three rounds.

## Status

| Screen | Field map | Gate | Notes |
|---|---|---|---|
| Employee listing | — | scoped diff | headers/headings 100% |
| **Add Employee** | ✅ `modules/people/specs/add_employee_fieldmap.json` | **MATCHES ✅** all 17 sections | rebuilt 2026-09-21 |
| Edit Employee | shares EmployeeForm | inherits Add | prefill maps the captured payload |
| View Employee | — | scoped diff | General Info only |

## Documented divergences (normalised by the gate)

| App | Prototype | Why |
|---|---|---|
| react-select (div + hidden input) | native `<select>` | same options and labels; the widget itself is out of scope |
| react-datepicker (`type="text"`) | native `type="date"` | so the field is actually usable in the prototype |

## Not yet captured

- **States**: every `+ Add` section is captured EMPTY only. Need one-row-added
  for Documents, Emergency Contact, Social Media Links, Previous Organizations,
  Children, Employee Role.
- **Behaviour**: before/after for `Same as present address`, `Fresher`,
  `Use external email instead`, `Employee is insured` — none of these were
  clicked in the real app, so what they reveal/hide is unknown.
- **Save payload**: taken from the app bundle, not from a live POST.
- The five non-General-Info View tabs.
