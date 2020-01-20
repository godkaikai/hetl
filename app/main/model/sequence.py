from ...init import db


class Sequence(db.Model):
    sequencename = db.Column(db.String(30), primary_key=True)
    minvalue_ = db.Column(db.String(20))
    maxvalue_ = db.Column(db.String(20))
    currentvalue = db.Column(db.String(20))
    cycle_ = db.Column(db.String(1))
    increment_ = db.Column(db.DECIMAL)

    __tablename__ = 'hetl_sequence'

    def __init__(self, sequencename, minvalue_, maxvalue_, currentvalue, cycle_, increment_):
        self.sequencename = sequencename
        self.minvalue_ = minvalue_
        self.maxvalue_ = maxvalue_
        self.currentvalue = currentvalue
        self.cycle_ = cycle_
        self.increment_ = increment_

    def save(self):
        db.session.add(self)
        db.session.commit()

    def keys(self):
        return ('sequencename', 'minvalue_', 'maxvalue_', 'currentvalue', 'cycle_', 'increment_')

    def __getitem__(self, item):
        return getattr(self, item)

    def update(self):
        value = int(self.currentvalue)
        if value >= int(self.maxvalue_) and int(self.cycle_) == 1:
            self.currentvalue == self.minvalue_
        else:
            self.currentvalue = str(value + int(self.increment_))
        db.session.add(self)
        db.session.commit()
