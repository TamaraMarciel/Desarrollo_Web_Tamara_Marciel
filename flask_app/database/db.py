from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, Enum, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base, relationship, joinedload
from datetime import datetime

DB_NAME = "tarea2"
DB_USERNAME = "cc5002"
DB_PASSWORD = "programacionweb"
DB_HOST = "localhost"
DB_PORT = 3306

DATABASE_URL = f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, echo=False, future=True)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()

# --- Models ---

class Region(Base):
    __tablename__ = 'region'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)
    
    comunas = relationship("Comuna", back_populates="region")


class Comuna(Base):
    __tablename__ = 'comuna'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)
    region_id = Column(Integer, ForeignKey('region.id'), nullable=False)
    
    region = relationship("Region", back_populates="comunas")
    avisos = relationship("AvisoAdopcion", back_populates="comuna")


class AvisoAdopcion(Base):
    __tablename__ = 'aviso_adopcion'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    fecha_ingreso = Column(DateTime, nullable=False, default=datetime.now)
    comuna_id = Column(Integer, ForeignKey('comuna.id'), nullable=False)
    sector = Column(String(100), nullable=True)
    nombre = Column(String(200), nullable=False)
    email = Column(String(100), nullable=False)
    celular = Column(String(15), nullable=True)
    tipo = Column(Enum('gato', 'perro', name='tipo_mascota'), nullable=False)
    cantidad = Column(Integer, nullable=False)
    edad = Column(Integer, nullable=False)
    unidad_medida = Column(Enum('a', 'm', name='unidad_medida'), nullable=False)
    fecha_entrega = Column(DateTime, nullable=False)
    descripcion = Column(Text, nullable=True)
    
    comuna = relationship("Comuna", back_populates="avisos")
    fotos = relationship("Foto", back_populates="aviso", cascade="all, delete")
    contactos = relationship("ContactarPor", back_populates="aviso", cascade="all, delete")


class Foto(Base):
    __tablename__ = 'foto'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    ruta_archivo = Column(String(300), nullable=False)
    nombre_archivo = Column(String(300), nullable=False)
    aviso_id = Column(Integer, ForeignKey('aviso_adopcion.id'), nullable=False)
    
    aviso = relationship("AvisoAdopcion", back_populates="fotos")


class ContactarPor(Base):
    __tablename__ = 'contactar_por'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(Enum('whatsapp', 'telegram', 'X', 'instagram', 'tiktok', 'otra', name='tipo_contacto'), nullable=False)
    identificador = Column(String(150), nullable=False)
    aviso_id = Column(Integer, ForeignKey('aviso_adopcion.id'), nullable=False)
    
    aviso = relationship("AvisoAdopcion", back_populates="contactos")


# --- Database Functions ---

def get_region_by_id(region_id):
    session = SessionLocal()
    region = session.query(Region).filter_by(id=region_id).first()
    session.close()
    return region


def get_all_regions():
    session = SessionLocal()
    regiones = session.query(Region).order_by(Region.nombre).all()
    session.close()
    return regiones


def get_comunas_by_region(region_id):
    session = SessionLocal()
    comunas = session.query(Comuna).filter_by(region_id=region_id).order_by(Comuna.nombre).all()
    session.close()
    return comunas


def get_comuna_by_id(comuna_id):
    session = SessionLocal()
    comuna = session.query(Comuna).filter_by(id=comuna_id).first()
    session.close()
    return comuna


def get_last_avisos(limit=5):
    session = SessionLocal()
    avisos = session.query(AvisoAdopcion)\
        .options(
            joinedload(AvisoAdopcion.comuna).joinedload(Comuna.region),
            joinedload(AvisoAdopcion.fotos),
            joinedload(AvisoAdopcion.contactos)
        )\
        .order_by(AvisoAdopcion.fecha_ingreso.desc())\
        .limit(limit)\
        .all()
    session.close()
    return avisos


def get_avisos_paginated(page=1, per_page=5):
    session = SessionLocal()
    offset = (page - 1) * per_page
    avisos = session.query(AvisoAdopcion)\
        .options(
            joinedload(AvisoAdopcion.comuna).joinedload(Comuna.region),
            joinedload(AvisoAdopcion.fotos),
            joinedload(AvisoAdopcion.contactos)
        )\
        .order_by(AvisoAdopcion.fecha_ingreso.desc())\
        .limit(per_page)\
        .offset(offset)\
        .all()
    total = session.query(AvisoAdopcion).count()
    session.close()
    return avisos, total


def get_aviso_by_id(aviso_id):
    session = SessionLocal()
    aviso = session.query(AvisoAdopcion)\
        .options(
            joinedload(AvisoAdopcion.comuna).joinedload(Comuna.region),
            joinedload(AvisoAdopcion.fotos),
            joinedload(AvisoAdopcion.contactos)
        )\
        .filter_by(id=aviso_id)\
        .first()
    session.close()
    return aviso


def create_aviso(fecha_ingreso, comuna_id, sector, nombre, email, celular, tipo, cantidad, edad, unidad_medida, fecha_entrega, descripcion):
    session = SessionLocal()
    nuevo_aviso = AvisoAdopcion(
        fecha_ingreso=fecha_ingreso,
        comuna_id=comuna_id,
        sector=sector,
        nombre=nombre,
        email=email,
        celular=celular,
        tipo=tipo,
        cantidad=cantidad,
        edad=edad,
        unidad_medida=unidad_medida,
        fecha_entrega=fecha_entrega,
        descripcion=descripcion
    )
    session.add(nuevo_aviso)
    session.commit()
    aviso_id = nuevo_aviso.id
    session.close()
    return aviso_id


def create_foto(ruta_archivo, nombre_archivo, aviso_id):
    session = SessionLocal()
    nueva_foto = Foto(
        ruta_archivo=ruta_archivo,
        nombre_archivo=nombre_archivo,
        aviso_id=aviso_id
    )
    session.add(nueva_foto)
    session.commit()
    session.close()


def create_contacto(nombre, identificador, aviso_id):
    session = SessionLocal()
    nuevo_contacto = ContactarPor(
        nombre=nombre,
        identificador=identificador,
        aviso_id=aviso_id
    )
    session.add(nuevo_contacto)
    session.commit()
    session.close()