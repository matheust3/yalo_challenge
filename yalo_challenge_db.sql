--
-- PostgreSQL database dump
--

-- Dumped from database version 15.0 (Debian 15.0-1.pgdg110+1)
-- Dumped by pg_dump version 15.0 (Debian 15.0-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Alunos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Alunos" (
    id integer NOT NULL,
    cpf text NOT NULL,
    name text,
    email text,
    id_colegio integer NOT NULL,
    id_turma integer NOT NULL,
    score numeric(65,30)
);


ALTER TABLE public."Alunos" OWNER TO postgres;

--
-- Data for Name: Alunos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Alunos" (id, cpf, name, email, id_colegio, id_turma, score) FROM stdin;
\.


--
-- Name: Alunos Alunos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Alunos"
    ADD CONSTRAINT "Alunos_pkey" PRIMARY KEY (id);


--
-- Name: Alunos_cpf_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Alunos_cpf_key" ON public."Alunos" USING btree (cpf);


--
-- PostgreSQL database dump complete
--

