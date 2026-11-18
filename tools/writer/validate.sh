# usage: bash validate.sh NN   -> compiles ch01..chNN-chapters present into a temp root (dist untouched); prints only lines about chNN + summary
NN=$1; ROOT=/Users/atishmondi/Documents/german/sites/german-current; T=$(mktemp -d)
mkdir -p $T/content/a1 $T/dist; cp $ROOT/content/*.json $T/content/; cp $ROOT/compile-course.py $T/
for f in $ROOT/content/a1/ch0[12].json $ROOT/content/a1/ch$NN.json; do cp $f $T/content/a1/; done
python3 $T/compile-course.py --partial --root $T 2>&1 | grep -E "ch$NN|error|lessons|questions|wrote" ; rm -rf $T
