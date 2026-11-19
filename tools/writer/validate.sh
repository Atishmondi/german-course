# usage: [LEVEL=a2] bash validate.sh NN -> compiles the whole content tree in a temp root (dist untouched); prints lines about chNN of LEVEL + summary
NN=$1; LV=${LEVEL:-a1}; ROOT=/Users/atishmondi/Documents/german/sites/german-current; T=$(mktemp -d)
mkdir -p $T/dist; cp -R $ROOT/content $T/; cp $ROOT/compile-course.py $T/
python3 $T/compile-course.py --partial --root $T 2>&1 | grep -E "$LV/ch$NN|error|$LV:|questions|wrote" ; rm -rf $T
