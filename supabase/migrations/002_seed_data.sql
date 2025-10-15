-- Seed data for the class scheduling system
-- Based on the Computer Science Master's program example

-- Insert sample program
INSERT INTO
    programs (name, code, level)
VALUES (
        'Shkenca Kompjuterike',
        'CS_MASTER',
        'MASTER'
    );

-- Insert sample instructors
INSERT INTO
    instructors (name, title)
VALUES ('Korab Rrmoku', 'Professor'),
    (
        'Shkëmb Abdullahu',
        'Associate Professor'
    ),
    (
        'Behar Baxhaku',
        'Assistant Professor'
    ),
    ('I.Dëstani', 'Professor'),
    (
        'Edmond Aliaga',
        'Associate Professor'
    ),
    (
        'Belinda Shahani',
        'Assistant Professor'
    ),
    ('Eliot Bytyçi', 'Professor'),
    (
        'Erblin Halalaku',
        'Associate Professor'
    ),
    ('Faton Berisha', 'Professor');

-- Insert sample rooms
INSERT INTO
    rooms (
        name,
        code,
        capacity,
        room_type
    )
VALUES (
        'Lab M',
        'LAB_M',
        30,
        'COMPUTER_LAB'
    ),
    (
        'Lab V',
        'LAB_V',
        25,
        'COMPUTER_LAB'
    ),
    (
        'Room 112',
        'R112',
        50,
        'LECTURE'
    ),
    (
        'Room 113',
        'R113',
        50,
        'LECTURE'
    ),
    (
        'Room 153',
        'R153',
        40,
        'LECTURE'
    );

-- Get the program ID for Computer Science Master's
DO $$
DECLARE
    cs_program_id UUID;
    instructor_ids UUID[];
    room_ids UUID[];
BEGIN
    -- Get program ID
    SELECT id INTO cs_program_id FROM programs WHERE code = 'CS_MASTER';
    
    -- Get instructor IDs in order
    SELECT ARRAY(SELECT id FROM instructors ORDER BY name) INTO instructor_ids;
    
    -- Get room IDs
    SELECT ARRAY(SELECT id FROM rooms ORDER BY name) INTO room_ids;
    
    -- Insert sample courses
    INSERT INTO courses (program_id, name, code, credits, ects_credits, lecture_hours, lab_hours, semester, year) VALUES 
    (cs_program_id, 'Hyrje në shkencën e të dhënave', 'HSD_001', 2, 6, 2, 2, 1, 2025),
    (cs_program_id, 'Hyrje në shkencën e të dhënave', 'HSD_002', 2, 6, 2, 2, 1, 2025),
    (cs_program_id, 'Kalkulusi i avancuar', 'KA_001', 2, 6, 2, 2, 1, 2025),
    (cs_program_id, 'Kalkulusi i avancuar', 'KA_002', 2, 6, 2, 2, 1, 2025),
    (cs_program_id, 'Statistikë e avancuar', 'SA_001', 2, 6, 2, 2, 1, 2025),
    (cs_program_id, 'Metodologjia e hulumtimit shkencor', 'MHS_001', 3, 6, 3, 1, 1, 2025),
    (cs_program_id, 'Metodologjia e hulumtimit shkencor', 'MHS_002', 3, 6, 3, 1, 1, 2025),
    (cs_program_id, 'Programim funksional', 'PF_001', 2, 6, 2, 2, 1, 2025),
    (cs_program_id, 'Programim funksional', 'PF_002', 2, 6, 2, 2, 1, 2025);
    
WITH course_map AS (
  SELECT * FROM (VALUES
    -- code       , instructor_name     , room_code, dow,  start ,  end
    ('HSD_001'    ,'Korab Rrmoku'       ,'LAB_M'   , 3 , '18:30','20:00'),
    ('HSD_002'    ,'Shkëmb Abdullahu'   ,'LAB_M'   , 4 , '18:30','20:00'),
    ('KA_001'     ,'Behar Baxhaku'      ,'LAB_V'   , 1 , '15:00','16:30'),
    ('KA_002'     ,'I.Dëstani'          ,'LAB_V'   , 3 , '15:00','16:30'),
    ('SA_001'     ,'Edmond Aliaga'      ,'LAB_M'   , 1 , '10:00','11:30'),
    ('MHS_001'    ,'Eliot Bytyçi'       ,'R153'    , 1 , '15:45','19:15'),
    ('PF_001'     ,'Faton Berisha'      ,'R153'    , 3 , '15:45','19:15'),
    ('PF_002'     ,'Faton Berisha'      ,'R153'    , 1 , '15:45','19:15')
  ) AS t(code, instructor_name, room_code, day_of_week, start_time_text, end_time_text)
),
mapped AS (
  SELECT
    c.id AS course_id,
    i.id AS instructor_id,
    r.id AS room_id,
    m.day_of_week,
    m.start_time_text::time AS start_time,
    m.end_time_text::time   AS end_time
  FROM courses c
  JOIN course_map m ON m.code = c.code
  JOIN instructors i ON i.name = m.instructor_name
  JOIN rooms r ON r.code = m.room_code
  WHERE c.program_id = cs_program_id
)
INSERT INTO schedules (course_id, instructor_id, room_id, day_of_week, start_time, end_time, session_type)
SELECT course_id, instructor_id, room_id, day_of_week, start_time, end_time, 'LECTURE'
FROM mapped;
    
END $$;