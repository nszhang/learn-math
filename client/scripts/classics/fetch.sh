cd "$(dirname "$0")"
get() { id=$1; name=$2; d=""; s=${id%?}; for ((i=0;i<${#s};i++)); do d="$d/${s:$i:1}"; done; [ -z "$d" ] && d="/0";
  for f in "$id-0.txt" "$id.txt" "$id-8.txt"; do code=$(curl -sSL -m 40 -o "$name.txt" -w "%{http_code}" "https://gutenberg.pglaf.org$d/$id/$f"); [ "$code" = 200 ] && { echo "ok $name ($(wc -c < $name.txt))"; return; }; done; echo "FAIL $name $id"; rm -f "$name.txt"; }
get 21 aesop; get 14838 peterrabbit; get 136 childsgarden; get 11757 velveteen
get 11 alice; get 55 oz; get 289 willows; get 271 blackbeauty; get 2591 grimm; get 1597 andersen
get 45 anne; get 113 secretgarden; get 74 tomsawyer; get 514 littlewomen; get 236 junglebook; get 16 peterpan; get 120 treasure; get 1448 heidi
get 46 carol; get 1661 holmes; get 215 callwild; get 2148 poe2; get 7256 ohenry; get 521 crusoe; get 103 eighty
get 1513 romeo; get 1400 greatexp; get 84 frankenstein; get 43 jekyll; get 64317 gatsby; get 29345 frost; get 353 mccrae; get 12242 dickinson; get 1041 sonnets; get 207 service
get 1533 macbeth; get 1524 hamlet; get 1260 janeeyre; get 219 heartdark; get 768 wuthering; get 174 dorian
