# IXL Canada parity check

```bash
cd client/scripts/ixl-check
python3 scrape.py      # downloads every ca.ixl.com Math / ELA / Science grade page → ixl_current.json
node diff.mjs          # lists IXL skills (by grade + title) missing from our catalog → missing.json
```

Last run 2026-11-21: 0 missing of 4,464 math, 2,134 ELA and 846 science skills.
